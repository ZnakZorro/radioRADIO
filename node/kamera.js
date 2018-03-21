#!/usr/local/bin/node
"use strict";

const moddir = '/usr/local/lib/node_modules/';
const spawn = require('child_process').spawn;
const express     = require(moddir+"express");


function klik2Buffer(params,callback,res,typ){
		typ = typ || 'jpg';
		var args = params.split(' ').concat(['-o',  '-']);
		console.log('klik2Buffer=',args);
		var child = spawn('raspistill',args);
		var tablica =[];
		
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

var akcja = function(dane,res,typ){
	typ = typ || 'jpg';
	//console.log('akcja dane=',dane.length,typeof(res));
	if (res){
		if (typ==='html'){
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('<html><body><title>camera</title>');
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
	var params = '-rot 180 -w 480 -h 320 -a 8';
	klik2Buffer(params,akcja,res,'html');
});

app.get('/:width/:height/:shutter', function (req, res) {
	let width   = req.params.width || 640;
	let height  = req.params.height || 480;
	let shutter = req.params.shutter || 50000;
	var params = '-rot 180 -w '+width+' -h '+height+' -a 8 -ss '+shutter;
	//console.log(width,height,shutter);
	//console.log(params);
	klik2Buffer(params,akcja,res,'jpg');
});


server.listen('7777',function(){
	console.log('\n  Listen on :7777\n');
});

