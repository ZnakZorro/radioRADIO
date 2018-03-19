"use strict"; 
const moddir      = '/usr/local/lib/node_modules/';
const http = require('http');
const exec = require('child_process').exec;
//const request     = require(moddir+"request");
const fs          = require('fs');


function sendPage(res,message,command,skrypt){
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "*");
res.setHeader("Access-Control-Allow-Headers", "*");
res.writeHead(200, {'Content-Type': 'text/html'});

res.write(`
<html><head><!doctype html><html><head><meta charset="utf-8"><title>SOS</title>
<meta name="viewport" content="width=device-width, user-scalable=no,initial-scale=1, maximum-scale=1">
<meta name="mobile-web-app-capable" content="yes">
<link rel="shortcut icon" href="data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAT0EyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAABAAAAAAAAAAAQAAAAAAAAAAEAAAAAAAAAABAAAAAAAAAAAQAAAAAAAAAAEAAAAAAAAAABAAAAAAAAAAAQAAAAAAAAAAEAAAAAAAAAABAAAAAAAAAAAQAAAAAAAAAAEAAAAAAAAAABAAAAAAAAAAAQAAAAAAAAAAF//wAAv/8AAN//AADv/wAA9/8AAPv/AAD9/wAA/v8AAP9/AAD/vwAA/98AAP/vAAD/9wAA//sAAP/9AAD//gAA" />
<style>
body{font:normal 17px verdana} a{text-decoration:none; margin:0;}
div.wrap {background:white; position:relative;}
div {margin:1%; padding:0.5%;border-bottom:1px solid #e8e8e8; clear:both; background:#f8f8f8;}
div.main {max-width:800px; margin:auto;}
a {text-align:center; padding:0.33em; margin:0.2em; background:#ddd;line-height:1.5em;display: inline-block; border:1px solid gray; border-radius:0.5em;min-width:5.8em;}
</style>
</head>
<body>
<div class="wrap">
<div class="main">
<h3>SOS</h3>
	<div>
		<a href="/">Start</a>
		<a href="/mpc/play">Play</a>
		<a href="/mpc/stop">Stop</a>
		<a href="/mpc/current">Info</a>
		<a href="/mpc/play/1">TOK FM</a>
		<a href="/mpc/play/2">RMF Classic</a>
		<a href="/mpc/play/61">Classic 61</a>
		<a href="/mpc/play/57">Classic 57</a>
	</div>

	<div>
		<a href="/reboot">reboot</a>
		<a href="/poweroff">poweroff</a>
		<a href="/ls/-l">LS</a>
		<a href="/df/-h">DF</a>
		<a href="/temp">Temp</a>
		<a href="/wifi">WIFI</a>
		<a href="/cpu">CPU</a>
	</div>
	<div>
		<a href="/camera">Klik</a>
	</div>
	<div>${command}</div>
	<div>${message}</div>
</div>
</div>
</body></html>	
`);
res.end(skrypt+'\n');	
}

function sendImage(res,imgURL){
	console.log(imgURL);
	var img = fs.readFileSync('/home/pi/app/radio/public/'+imgURL);
	res.writeHead(200, {'Content-Type': 'image/jpg'});
	res.end(img,'binary');	
}

http.createServer((req, res) => {
	let arr = (req.url).split('/')
	let s= arr.shift();
	console.log('#67arr=',arr);
	var akcja = arr[0];
	console.log('#69 akcja=',akcja);
	
	if (akcja =='favicon.ico') {res.end(); return;}
	if (akcja =='1.jpg') {sendImage(res,'1.jpg'); return;}
	
	let message ='';
	let skrypt ='';
	//skrypt = '<script>window.location = "/";</script>\n;'
		let cmd= arr[0] || null;
		let key= arr[1] || null;
		let val= arr[2] || null;
		let command='';
			//-----------------------------------------------
			if(cmd==='mpc' || cmd==='ls' || cmd==='df'){
				command +=cmd;
				if(key){
					command +=' '+key;
					if(val){
						command +=' '+val;
					}
				}
			}
			if (cmd ==='reboot')   command='sudo reboot';
			if (cmd ==='poweroff') command='sudo poweroff';
			if (cmd ==='temp')     command='/opt/vc/bin/vcgencmd measure_temp';
			if (cmd ==='wifi')     command='cat /proc/net/wireless';
			if (cmd ==='cpu')      command="grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage "+'"%"'+"}'";
			if (cmd ==='camera')   command='raspistill --nopreview --timeout 1 -rot 180 -w 800 -h 600 -o /home/pi/app/radio/public/1.jpg';
			
			 

			//-----------------------------------------------
	
	if (command){
		console.log('command=',command);
		try {
			exec(command,function(err, stdout, stderr){
				console.log('#err=',err);
				console.log('#stdout=',stdout);
				console.log('#stderr=',stderr);
				let info = '';
				if (stdout) info += stdout;
				if (stderr) info += stderr;
				message += '<pre>'+info+'</pre>';
				if (akcja=='camera') message = '<img src="1.jpg" />';
				sendPage(res,message,command,skrypt);
				
			});
		} catch(err){console.error(0,err);}
	} else {
		try {
			sendPage(res,message,command,skrypt);
		} catch(err){console.error(1,err);}
	}

	
}).listen(9999,function(){
	console.log('Server running at /:9999');
});


