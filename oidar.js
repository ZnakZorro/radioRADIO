#!/usr/local/bin/node
"use strict";
const http = require('http');
const execSync = require("child_process").execSync;	
let startHTML ='<html>\n<head>\n';	
	startHTML +='<meta charset="utf-8">\n';	
	startHTML +='<meta name="viewport" content="width=device-width,initial-scale=1">\n';
	startHTML +='<link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=" rel="icon" type="image/x-icon" />\n';
	startHTML +='<title>OIDAR</title>\n';	
	startHTML +='<style>\n';
		startHTML +='body{font:normal 12pt verdana; margin:0.5%;}\n';
		startHTML +='div {float:left; margin:1%;padding:1%; width:90%;}\n';
		startHTML +='div.klawisze  {}\n';
		startHTML +='div.container {width:91%; margin:1% 3%; border:1px solid #ddd; background:#f8f8f8;  border-radius:0.5em;}\n';
		startHTML +='a {float:left; text-decoration:none; color:#124; border:1px solid gray; background:#e0e0e0; padding:0.5em; margin:0.5em; border-radius:0.5em;}\n';
		
	startHTML +='</style>\n';
	startHTML +='</head>\n<body>\n\n';
	startHTML +='<div class="klawisze">\n';
		startHTML +='<a href="/radio/1">TOK-FM</a>\n';
		startHTML +='<a href="/radio/2">RMF-Classic</a>\n';
		startHTML +='<a href="/radio/5">PR 3</a>\n';
		startHTML +='<a href="/radio/8">PR Szn</a>\n';
	startHTML +='</div>\n';
	startHTML +='<div class="container">\n';
	
const stopHTML =`
</div>
</body>
</html>
`;

const pageINNER =`
<div class="klawisze">
<a href="/info">Info</a>
<a href="/play">Play</a>
<a href="/stop">Stop</a>
<a href="/volplus">Vol+</a>
<a href="/volminus">Vol-</a>
<a href="/prev">Prev</a>
<a href="/next">Next</a>
</div>
`;


http.createServer(function (req, res) {
	let param = req.url.split('/').slice(1);
	//console.log('param=',param);
	let mpcexe = 'mpc current';
	if (param[0]==='radio' && param[1]){mpcexe = 'mpc play '+param[1];}
	if (param[0]==='volplus')   {mpcexe = 'mpc volume +5';}
	if (param[0]==='volminus')  {mpcexe = 'mpc volume -5';}
	if (param[0]==='play')      {mpcexe = 'mpc play';}
	if (param[0]==='stop')      {mpcexe = 'mpc stop';}
	if (param[0]==='next')      {mpcexe = 'mpc next';}
	if (param[0]==='prev')      {mpcexe = 'mpc prev';}

	let info = execSync(mpcexe).toString();
	//console.log(info);
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(startHTML+pageINNER+info+stopHTML);
	res.end();
}).listen(8080,function(){console.log(8080);});
