#!/usr/local/bin/node
"use strict";
const spawn = require('child_process').spawn;

	const args = ['--exif' ,'none', '-rot','180','-w','320','-h','240','-a','12','-t','1','-q','35','--thumb','none','-mm','matrix','-drc','high','-n','-o','-'];  
	
	let child = spawn('raspistill',args);
	let tablica =[];
	
	child.stdout.on('data', function(buff){
		console.log(0,buff.length)
		tablica.push(buff);
	});
	
	child.stdout.on('end', function(s,x){
		let buf = Buffer.concat(tablica);
		console.log(9,buf.length)
		//console.log(buf.toString('base64'));
		//console.log(buf.toString('binary'));
		console.log('<img src="data:image/jpeg;base64,'+(buf.toString('base64'))+'" />');
		//encodeURIComponent
	});
	
	child.stderr.on('data', function(s){console.log('stderr=',s);});
	child.on('error', function(s){console.log('on error=',s)});
