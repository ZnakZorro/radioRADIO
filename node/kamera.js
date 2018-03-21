#!/usr/local/bin/node
"use strict";

const moddir = '/usr/local/lib/node_modules/';
const spawn = require('child_process').spawn;
const express     = require(moddir+"express");

var command='';

function klik2Buffer(params,callback,res,typ){
		typ = typ || 'jpg';
		let args = params.split(' ').concat(['-t', '1', '-q','90']);
		args = args.concat(['--thumb', 'none', '-mm', 'matrix']); //matrix, spot, average, backlit
		args = args.concat(['-drc', 'high']);
		args = args.concat(['-ISO', '100']);
		args = args.concat(['-n']); 
		args = args.concat(['-o',  '-']);
		command = args.join(' ');
		 
		console.log('klik2Buffer=',args);
		let child = spawn('raspistill',args);
		let tablica =[];
		
		child.stdout.on('data', function(buff){			
			tablica.push(buff);
		});
		
		child.stdout.on('end', function(s,x){
			let buf = Buffer.concat(tablica);
			if (typ==='html') callback(buf.toString('base64'),res,typ);
			if (typ==='jpg')  callback(buf.toString('binary'),res,typ);
		});
		
		child.stderr.on('data', function(s){console.log('stderr=',s);});
		child.on('error', function(s){console.log('on error=',s)});
}

let akcja = function(dane,res,typ){
	typ = typ || 'jpg';
	
	if (res){
		if (typ==='html'){
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('<html><head><title>camera</title><style>body {font:normal 16px verdana};a{text-decoration:none;}</style></head><body>');
				//res.write('<p><button onClick="location.reload()">Reload</button></p>');
				res.write('<p>');
					res.write('<a href="/">IMAGE</a> ');
					res.write('<a href="/test/12">test 12</a> ');
					res.write('<a href="/test/252">test 252</a> ');
				res.write('</p>');
				command = 'raspistill '+command;
				res.write('<p>'+command+'</p>');
				res.write('<img src="data:image/jpeg;base64,'+dane+'"/>');
			res.end('</body></html>');
		}
		
		if (typ==='jpg'){
			res.writeHead(200, {'Content-Type': 'image/jpeg'});
			res.write(dane,"binary");
			res.end();
		}
	}
}



let app = express();
let server  = require("http").createServer(app);

app.get("/", function(req, res){
	let params = '-rot 180 -w 800 -h 600';
	klik2Buffer(params,akcja,res,'html');
});

app.get("/test/:annot", function(req, res){
	let annot   = req.params.annot || 4;
	let params = '-rot 180 -w 1200 -h 800 -a '+annot;
	klik2Buffer(params,akcja,res,'html');
});

app.get('/:width/:height/:shutter', function (req, res) {
	let width   = req.params.width || 640;
	let height  = req.params.height || 480;
	let shutter = req.params.shutter || 0;
	let params = '-rot 180 -w '+width+' -h '+height+' -a 8';
	if (parseInt(shutter)>10) params += ' -ss '+shutter;
	klik2Buffer(params,akcja,res,'jpg');
});


server.listen('7777',function(){
		console.log('------------------------------------\n  Listen on 7777\n------------------------------------\n');
});

