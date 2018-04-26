#!/usr/local/bin/node
"use strict";
const http = require('http');
const spawn = require('child_process').spawn;
const server = http.createServer();


function klik(req, res, typ) {
	let args = [];  
	if (typ===0) args = ['-rot','180','-w','600','-h','400', '-t','1','-q','95','--thumb','none','-mm','matrix','-drc','high','-n','-o','-'];  
	if (typ===1) args = ['-rot','180','-w','1200','-h','800','-t','1','-q','95','--thumb','none','-mm','matrix','-drc','high','-n','-o','-'];  
	if (typ===-1) args = ['-rot','180','-w','800','-h','600','-a','92','-t','1','-q','95','--thumb','none','-mm','matrix','-drc','high','-n','-o','-'];  
 args = ['-w','80','-h','20','-t','1','-ss','150000','-roi','1,0.3,1,0.3','-vf','-hf','-o','-'];	
	console.log('raspistill '+args.join(' '));
	const proc = spawn('raspistill', args);
	proc.stdout.pipe(res);
}

server.on('request', (req, res) => {
	console.log(req.url);
	
		 if (req.url === '/') 		{page(req, res, 0);} 
	else if (req.url === '/klik') 	{klik(req, res, 1);} 
	else if (req.url === '/test') 	{klik(req, res, -1);} 
	else if (req.url === '/favicon'){res.status(204);}
	else {res.end('Ok');}
});


function page(req, res, typ){
res.writeHead(200, {'Content-Type': 'text/html', 'Cache-Control': 'no-cache'});

res.end(`
<html><head><title>camera</title>
<style>
	body{font:normal 16px verdana;}
	a{text-decoration:none;padding-right:1.5em;}
</style>
</head>
<body>
<p>
	<a href="/">reload</a> 
	<a href="/test">test</a> 
	<a href="/klik">klik</a> 
</p>
<img src="./klik"/ style="max-width:100%;">
</body></html>`);		
}

server.listen(3333,function(){console.log(':3333')});
