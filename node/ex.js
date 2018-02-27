#!/usr/local/bin/node
"use strict";
var execSync = require("child_process").execSync;
const express  = require("/usr/local/lib/node_modules/express");
const app = express();
app.use(express.static(__dirname + '/public/'));
const server  = require("http").createServer(app);

	function sendInfo(res,ret){
		//var j = JSON.stringify([ret]);
		//res.writeHead({'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});
			//res.setHeader("Content-Type", "application/json");
			//res.setHeader("Access-Control-Allow-Origin", "*");
			//res.setHeader("Access-Control-Allow-Methods", "*");
			//res.setHeader("Access-Control-Allow-Headers", "*");
		
		res.send(ret);
	}	


app.post("/info", function(req, res){
	res.send(execSync("mpc current").toString());
});

app.post("/radio/*", function(req, res){
	var param=req.params[0];
	if (param=="0") param="stop";
	var mpcexe = "mpc play "+param;
	if (param=="stop" || param=="play" || param=="current" || param=="next" || param=="prev" || param=="pause"|| param=="playlist" ) mpcexe = "mpc "+param;
	if (param=="info") mpcexe = "mpc current";
	if (param=="seek") mpcexe = "mpc seek +20%";
		try {
			var info = execSync(mpcexe).toString();
		} catch(err) {
			var info = err.stderr.toString();
		}
	res.send(info);
	//var ret  = (info);
	//sendInfo(res,ret);
});


server.listen('3333');
console.log("~~~3333\n");
