#!/usr/local/bin/node
"use strict";

//var execSync = require("child_process").execSync;
//var path     = require("path");

const exec = require("child_process").exec;
const modir     = '/usr/local/lib/node_modules/';
const request   = require(modir+'/request');
const express   = require(modir+'express');
const fs        = require("fs");

const SamsungRemote = require(modir+'samsung-remote');
const remote = new SamsungRemote({ip:"192.168.1.100"});



//const bodyParser = require(modir+'body-parser');
const app = express();
const DS='/';

app.use(express.static(__dirname+DS+'public'+DS));

function tim(){ return (new Date()).getTime();}

	let radios =[];
	
	function loadRadiosFromGithub(res){
		let url=  'https://raw.githubusercontent.com/ZnakZorro/radioRADIO/master/radio.json?nic='+tim();
		console.log(url);
		request.get(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				
							fs.writeFile(__dirname+DS+"radios.json", body, function(err) {
								if(err) {return console.log(err);}
								console.log("The file was saved!");
							}); 				
				let ret = JSON.stringify(radios);
				if(res) res.send(JSON.stringify({"command":"update","argument":"radio","o":"update/radio/from/github/ "+body}));
				loadRadios(null);
			}
		})
	}	
	
	function loadRadios(res){
			fs.readFile(__dirname+DS+"radios.json", 'utf8', function (err,body) {
			  if (err) {
					loadRadiosFromGithub(res)
					return console.log(err);
			  }
				//console.log('#25=',body);
				let json = JSON.parse(body);
				radios.length=0;
				json.forEach(function(s){radios.push(s);});
				//console.log(radios);
				let ret = JSON.stringify(radios);
				if(res) res.send(JSON.stringify({"command":"update","argument":"radio","o":"update/radio/from/github/ "+ret}));
				upPlaylistRadio(null);
			});
	}


	function upPlaylistRadio(res){
		var ile = radios.length-1;
		console.log('#73 radios.length=',ile);
		exec("mpc clear",function(e,o,s){
			radios.forEach(function(l,x){
				//console.log(x,ile,l.stream);
					exec("mpc add "+l.stream,function(e,o,s){
					if (x===ile){
						exec("mpc rm radio",function(e,o,s){
							exec("mpc save radio",function(e,o,s){
								console.log("#81 radio saved");
							})
						})
					}
				});
			});
			console.log("#78 upPlaylistRadio -----------");
			if(res) res.send(JSON.stringify({"command":"update","argument":"playlist/add/radio","o":JSON.stringify(radios)}));
		});
	}

	
// update radio from github
app.post('/loadradiofromgithub', function (req, res) {
	loadRadiosFromGithub(res);
});

// update radio from json file
app.post('/loadradio', function (req, res) {
	loadRadios(res);
});
	//let ret = loadRadios(res);
	
app.post('/updateplaylistradio', function (req, res) {
	upPlaylistRadio(res);
});	


// update folder
app.post('/update/*', function (req, res) {
	let folder  = req.params[0];
	exec("mpc update",function(e,o,s){
		console.log(e);
		exec("mpc clear",function(e,o,s){
			console.log(e);
			console.log("mpc add /media/pen/Music/"+folder);
			exec("mpc add /media/pen/Music/"+folder,function(e,o,s){
				console.log(e);
				exec("mpc rm "+folder,function(e,o,s){
					console.log(e);
					exec("mpc save "+folder,function(e,o,s){
						console.log(e);
						exec("mpc play",function(e,o,s){
							console.log(e);
							let out = o.trim();
							out = 'update/'+folder+'/ '+out;
							res.send(JSON.stringify({"command":"update","argument":folder,"o":out}));
						});	
					});	
				});	
			});	
		});	
	});	
});



// load radio playlist
app.post('/radio/playlist', function (req, res) {
	//console.log('#118 =  radio/playlist');
	//console.log(JSON.stringify({"command":"playlist","argument":"radio","o":radios}));
	res.send(JSON.stringify({"command":"playlist","argument":"radio","o":radios}));
});


// load playlist
app.post('/@mpc/*/*', function (req, res) {
	let command  = req.params[0];
	let argument = req.params[1];
	exec("mpc clear",function(e,o,s){
		exec("mpc "+command + ' '+argument,function(e,o,s){			
			exec("mpc play",function(e,o,s){
				let out = o.trim();
				out = command+'/'+argument+'/ '+out;
				res.send(JSON.stringify({"command":command,"argument":argument,"o":out}));
			});	
		});	
	});	
});

// mpc command
app.post('/mpc/*/*', function (req, res) {
	//console.log('#19 params=====',req.params); 
	let command  = req.params[0];
	let argument = req.params[1];
		//console.log('#22 = ',"mpc "+command + ' '+argument);
		exec("mpc "+command + ' '+argument,function(e,o,s){
			//console.log('e=',e);
			//console.log('o=',o);
			//console.log('s=',s);
			//console.log('----------');
			let out = o.trim();
			//console.log(out);
			res.send(JSON.stringify({"command":command,"argument":argument,"o":out}));
	});	
	
	//res.send(JSON.stringify({"command":command,"argument":argument}));
});



// update folder
app.post('/system/*', function (req, res) {
	let command  = req.params[0];
	exec(command,function(e,o,s){
		let out = '<pre>'+o.trim()+'</pre>';
		res.send(JSON.stringify({"command":command,"argument":"bash","o":out}));
	});
});

/*TV TV TV TV TV TV TV TV TV TV TV */
app.post('/tv/*', function (req, res) {
	let command  = req.params[0];
	if (czyTV != true) { 
		res.send(JSON.stringify({"command":command,"argument":"TV OFF","o":"TV off"}));
		return false;
	}
	//let tv = isTV();
	console.log('czyTV=',czyTV);
	//console.log('TV command= ',command,'isTV=',tv);
	remote.send(command, function callback(err) {
		if (err) {
			throw new Error(err);
		} else {
			// command has been successfully transmitted to your tv
			console.log('TV successfully ');
		}
	});
	
	res.send(JSON.stringify({"command":command,"argument":"TV","o":command}));

});


let czyTV = null;
function isTV(){
	// check if TV is alive (ping)
	remote.isAlive(function(err) {
		if (err) {
			//throw new Error('TV is offline');
			czyTV = false;
			return false;
		} else {
			console.log('TV is ALIVE!');
			czyTV = true;
			return true;
		}
	});
}




app.listen(1111, function () {
	console.log('--------------------------------------------------------');
		console.log('Static Server listening on port: 1111');
	console.log('--------------------------------------------------------\n');
	loadRadios(null);
	isTV();
	console.log(__dirname+DS+"radios.json");
});

