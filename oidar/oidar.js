#!/usr/local/bin/node
"use strict";
const http = require('http');
const execSync = require("child_process").execSync;	
const page = require('./M_oidar');

const KLAWISZE =`
<a href="/info">Info</a>
<a href="/play">Play</a>
<a href="/stop">Stop</a>
<a href="/volminus">Vol-</a>
<a href="/volplus">Vol+</a>
<a href="/prev">Prev</a>
<a href="/next">Next</a>
`;

let radioButtons = function(){
return `<a href="/radio/1">TOK-FM</a>
<a href="/radio/2">RMF-Classic</a>
<a href="/radio/5">PR 3</a>
<a href="/radio/8">PR Szn</a>
`;
}

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
	res.write(page.header('Oidar+'));
	res.write(page.div('container',radioButtons()));
	res.write(page.div('klawisze',KLAWISZE));
	res.write(page.pre('info',info));
	res.write(page.footer('Koniec'));
	res.end();
}).listen(8080,function(){console.log('::8080');});

