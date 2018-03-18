"use strict"; 
const moddir      = '/usr/local/lib/node_modules/';
const http = require('http');
const exec = require('child_process').exec;
//const request     = require(moddir+"request");
//const fs          = require('fs');


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
<style>body{font:normal 11pt verdana} a{text-decoration:none;}</style>
</head>
<body>
<h3>SOS</h3>
<div>
<a href="/">Start</a><br />
<a href="/mpc/play">Play</a><br />
<a href="/mpc/stop">Stop</a><br />
<a href="/mpc/current">Info</a><br />
<a href="/mpc/play/1">TOK FM</a><br />
<a href="/mpc/play/2">RMF Classic</a><br />
<a href="/mpc/play/61">Radio Classic</a><br />
<hr />
<a href="/ls/-l">LS</a><br />
<a href="/df/-h">DF</a><br />
<div>
<hr />
<div>${command}<div>
<hr />
<div>${message}<div>
</body></html>	
`);
res.end(skrypt+'\n');	
}

http.createServer((req, res) => {
	let arr = (req.url).split('/')
	let s= arr.shift();
	console.log('\narr=',arr);
	
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
			//-----------------------------------------------
	
	if (command){
		console.log('command=',command);
		exec(command,function(a,info,c){
			console.log(a)
			console.log(info)
			console.log(c)
			if (info) message += '<pre>'+info+'</pre>';
			sendPage(res,message,command,skrypt);
		});
	} else {
		sendPage(res,message,command,skrypt);
	}

	
}).listen(9999,function(){
	console.log('Server running at /:9999');
});


