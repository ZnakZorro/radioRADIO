#!/usr/local/bin/node
"use strict";
	
	let http = require('http');
	let path = require('path');
	let fs = require('fs');
	
	let server = http.createServer(function(req, res){
		//if (req.url==='/favicon.ico') console.log(req.url);	
		//console.log('Request for ' + req.url + ' by method ' + req.method);
		if(req.method == 'GET'){
			let fileurl;
			if (req.url == '/') fileurl = '/index.html';
			else {fileurl = req.url;}
			let filePath  = path.resolve('./public'+fileurl);
			let fileExt   = path.extname(filePath);
			if (fileExt == '.html'){
				fs.exists(filePath, function(exists){
					if(!exists){
						res.writeHead(404, {'Content-Type': 'text/html'});
						res.end('<h1>Error 404' + filePath + 'not found </h1>');
						return;
					}
					res.writeHead(200, {'Content-Type':'text/html'});
					fs.createReadStream(filePath).pipe(res);
				})
			}
		}
	}).listen(8080,function(){console.log('\n...................................\n   8080\n...................................\n');});
	
