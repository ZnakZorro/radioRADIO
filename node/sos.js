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
body,button{font:normal 17px verdana}
body,h3{margin:3px; padding:0;}
div.wrap {background:white; position:relative;}
div {margin:0.33%; padding:0.33%;border-bottom:1px solid #e8e8e8; clear:both; background:#f8f8f8;}
div.main {max-width:800px; margin:auto;}
a,button {text-align:center; padding:0.2em; margin:0.2em; background:#ddd;line-height:1.5em;display: inline-block; border:1px solid gray; border-radius:0.75em;min-width:6em;text-decoration:none;}
.re {background:#eec;}
.sy {background:#ccf;}
button:active,button:focus {outline: none;border-color:red; background:#888; opacity:0.7;}
pre {font-size:0.88em; width:100%; background:white;}
img {max-width:100%;}
</style>
<script>
function ajxx(u){if (confirm('Are you sure?')) ajx(u);}
function ajx(u){
	//console.log(u);
	fetch(u).then(function(res) {return res.text();}).then(function(text) {
	var arr = text.split('<!---->');
	//console.log(arr);
	document.getElementById("info").innerHTML = arr[2];
}).catch(error => console.error('Error:', error))}
</script>
</head>
<body>
<div class="wrap">
<div class="main">
<h3>SOS...</h3>
	<div>
		<button class="re" onClick='location.href="/"'>reLoad</button>
		<button onClick='ajx("/mpc/current")'>Info</button>
		<button onClick='ajx("/mpc/play")'>Play</button>
		<button onClick='ajx("/mpc/stop")'>Stop</button>
		<button onClick='ajx("/mpc/prev")'>Prev</button>
		<button onClick='ajx("/mpc/next")'>Next</button>
	</div>

	<div>
		<button onClick='ajx("/mpc/play/1")'>TOK FM</button>
		<button onClick='ajx("/mpc/play/2")'>RMF Classic</button>
		<button onClick='ajx("/mpc/play/8")'>Szczecin</button>
	</div>

	<div>
		<button class="sy" onClick='ajxx("/reboot")'>Reboot</button>
		<button class="sy" onClick='ajxx("/poweroff")'>PowerOFF</button>
	</div>
	<div>
		<button class="re" onClick='ajxx("/reradio")'>reRADIO</button>
		<button class="re" onClick='ajxx("/resos")'>reSOS</button>
		
	</div>
	<div>
		<button onClick='ajx("/psnode")'>PS node</button>
		<button onClick='ajx("/psradio")'>PS radio</button>
		<button onClick='ajx("/killradio")'>killRadio</button>
		<button onClick='ajx("/startradio")'>startRadio</button>
		<button onClick='ajxx("/camera")'>CAMERA</button>
	</div>

	<div>
		<button onClick='ajx("/ls/-l")'>LS</button>
		<button onClick='ajx("/df/-h")'>DF</button>
		<button onClick='ajx("/temp")'>Temp</button>
		<button onClick='ajx("/wifi")'>WIFI</button>
		<button onClick='ajx("/cpu")'>CPU</button>
		
		
	</div>
	<div>
		
	</div>
	<span id="info"></span>
	<!---->
	<pre id="command">${command}</pre>
	<pre id="message">${message}</pre>
	<!---->
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
			if (cmd ==='psnode')   command= `ps -ef | grep node | grep -v grep`;
			
			if (cmd ==='psradio')     command= `ps -ef | grep /radio/index.js | grep -v grep | awk '{print $2}'`;
			if (cmd ==='killradio')   command= `ps -ef | grep app/radio/index.js | grep -v grep | awk '{print "sudo kill -9 "$2}' | sh`;
			if (cmd ==='startradio')  command= `/usr/local/bin/node /home/pi/app/radio/index.js & > /dev/null`;
			
			if (cmd ==='reradio')     command= `ps -ef | grep app/radio/index.js | grep -v grep | awk '{print "sudo kill -9 "$2}' | sh && /usr/local/bin/node /home/pi/app/radio/index.js & > /dev/null`;
			if (cmd ==='resos')     command= `ps -ef | grep app/radio/sos.js | grep -v grep | awk '{print "sudo kill -9 "$2}' | sh && /usr/local/bin/node /home/pi/app/radio/sos.js & > /dev/null`;
			console.log(command);
			
			 

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
				message += info;
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


