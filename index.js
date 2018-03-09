#!/usr/local/bin/node

"use strict";

//var http = require('http');
var express  = require("/usr/local/lib/node_modules/express");
var execSync = require("child_process").execSync;
//var path     = require("path");
var fs       = require("fs");
//var bodyParser = require('/usr/local/lib/node_modules/body-parser')

var DS="/";
var port = 8888;
var startPage = "/public/";
var actualPlaylist = "radio";

//var debug = true;
var myIP  = "127.0.0.1";
var debug = true;

var args = process.argv.slice(2);
//console.log(process.argv);
if(args[0]==="-q") debug=false;


var getDirectories = function (srcpath) {
	return fs.readdirSync(srcpath).filter(function(file) {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	});
};

var getFiles = function (dir) {
	return fs.readdirSync(dir).filter(function (file) {
		return fs.statSync(dir+"/"+file).isFile();
	});
};


function readHTMLfile(filedir){
	if (fs.lstatSync(filedir).isFile())	{
		try {
			var data = fs.readFileSync(filedir);
			//console.log(data.toString())
			if (data.length>10){
				return(data.toString());
			}
		} catch (err) {
			if (err.code !== "ENOENT") throw err;
			console.log("error");
			return "";
		}
	}	else return "";
}



function getFilesFromPlaylist(active){
	
	var username = __dirname.split(DS)[2];
	var infos = {"username":username}
	
	var playlist = {};
	console.log("/60 actualPlaylist=",actualPlaylist);
	console.log("sed -n '"+active+"p' < /home/"+username+"/tmp/"+actualPlaylist+".m3u");
	var file=execSync("sed -n '"+active+"p' < /home/"+username+"/tmp/"+actualPlaylist+".m3u").pars();
	var arr = file.split(DS);
	arr.pop();
	//var dir = arr.join(DS);
	
	console.log("\n/67 file=",file);
	console.log("/68 arr=",arr);
	
	var m3u = readHTMLfile("/home/"+username+"/tmp/mpc.m3u");
	var pls = m3u.split("\n");
	pls.forEach(function(l,i){
		var a = l.split(DS);
		//if (a[0].indexOf('http') != -1) {console.log('/76 a0=',a[0].indexOf('http')); console.log(arr[i]);arr[i]='radio';}
		if (a[0] && a[0].indexOf("http") == -1){
			var song = {"i":(i+1),"s":a.pop()};
			var ile = a.length;
			if (!playlist[a[0]]) playlist[a[0]] ={};
			if (!playlist[a[0]][a[1]]) playlist[a[0]][a[1]] =[];
			if (ile==2) {
				playlist[a[0]][a[1]].push(song);
			}
			if (ile==3) {
				if (!playlist[a[0]][a[1]][a[2]]) playlist[a[0]][a[1]][a[2]] =[];
				playlist[a[0]][a[1]][a[2]].push(song);
			}
		}	//else {console.log('rrrrrrrrradio');}	
	});
	infos.playlist = arr[0];
	infos.folder   = arr[1];
		infos.myIP  = myIP;
		infos.args  = args;
		infos.freemem  = execSync("free -h | grep Mem | awk '{print $4}'").pars();
		infos.heapmem  = Math.round(process.memoryUsage().heapUsed / 1000000);
	if (arr[2]) infos.folder = arr[2];
	console.log('infos=',infos);
	
	if (arr[0]=="http:") {return({"info":infos});}

	if (arr.length==2) return({"info":infos,"songs":playlist[arr[0]][arr[1]]});
	if (arr.length==3) return({"info":infos,"songs":playlist[arr[0]][arr[1]][arr[2]]});
	
	
	return null;
}

Buffer.prototype.pars = function() {return this.toString().trim();};
		
function parseMpcInfo(f){
	var ret = {"type":"info","active":"","title":"???","info":"???","vol":"","extra":"","actualPlaylist":actualPlaylist,"raw":f};
	if (f.length===0) {return ret;}
	
			var mm = f.match(/\.*?#(.*?)\/.*?\nvolume: (.*?)% .*?repeat: (.*?) .*?random: (.*?) .*?single: (.*?) .*?/m);	 	
			console.log('mm=',mm);
			if (mm) {
				ret.mm = mm;
				if (mm[1]) ret.active = mm[1];
				if (mm[2]) ret.vol    = mm[2];
				if (mm[3]) ret.rnd   = mm[3]; 
				if (mm[4]) ret.repeat   = mm[4]; 
				if (mm[5]) ret.single   = mm[5]; 
			}
	
	var infoarr=String(f).split("\n");
	if (infoarr.length==4) {ret.title="ERROR"; ret.info=infoarr[3]; return ret;}
	var info = String(f).split("\n")[0];
	var arr = info.split("/");
	ret.title=arr[0];
	var last = arr.length-1;
	if (last>0) ret.info = arr[last];
	if (last>1) ret.info = arr[last-1]+" > "+arr[last];
	return ret;
}
			
	
			
	function sendInfo(res,ret){
		var j = JSON.stringify([ret]);
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "*");
		res.setHeader("Access-Control-Allow-Headers", "*");
		
		res.send(j);
	}	


/* START ---------------------  START ---------------------  START --------------------- START */
myIP=execSync("hostname -I").pars();
var playlist = execSync("egrep -v '(^#|^\s*$|^\s*\t*#)' /etc/mpd.conf | grep playlist_directory | awk '{print $2}' | tr --delete '\"'").pars();
var musicdir = execSync("egrep -v '(^#|^\s*$|^\s*\t*#)' /etc/mpd.conf | grep music_directory | awk '{print $2}' | tr --delete '\"'").pars();
console.log("myIP="+myIP,"\nplaylist="+playlist,"\nmusicdir="+musicdir);
//var a = ((execSync('hostname && hostname -I && hostname -A').pars().split("\n"))[1]).trim();//console.log(2,a);
	
var app = express();
var server  = require("http").createServer(app);

//app.use(express.bodyParser());

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true})); 



app.use(express.static(__dirname + startPage));
/*
app.get("/volume/*", function(req, res){
	var param=req.params[0];
	if (parseInt(param) >0) param = "+"+param;
	if (parseInt(param) ===0) param = "85";
	console.log("/230 GET VOLUME PARAM=",typeof(param),param,parseInt(param));
	//if (parseInt(param)>100) param='100';
	//if (parseInt(param)<30) param='30';
	//console.log("/163 VOLUME PARAM=",typeof(param),param,parseInt(param));
	var info=execSync("mpc volume "+param).pars();
	var ret = parseMpcInfo(info);
	sendInfo(res,ret);
});
*/



app.get("/*", function(req, res){
	res.send(null);
});
/*
app.post("/info", function(req, res){
	var info = execSync("mpc current").pars();
	var ret  = parseMpcInfo(info);
	sendInfo(res,ret);
});
*/
/*
app.post("/info", function(req, res){
	//var param=req.params[0];
	var info=execSync("mpc").pars();
	var ret = parseMpcInfo(info);
	sendInfo(res,ret);
});
app.get("/info", function(req, res){
	//var param=req.params[0];
	var info=execSync("mpc").pars();
	var ret = parseMpcInfo(info);
	sendInfo(res,ret);
});
*/

app.post("/play", function(req, res){
	//var param=req.params[0];
	var info=execSync("mpc play").pars();
	//console.log("/121 info play=\n",info);
	var ret = parseMpcInfo(info);
	//console.log("/123 ret=\n",ret);
	sendInfo(res,ret);
});

app.post("/playlist", function(req, res){
	//var param=req.params[0];
	var info = execSync("mpc playlist").pars();
	var arr = info.split("\n");
	var ret = JSON.stringify(arr);
	//console.log(ret)
	sendInfo(res,{'type':'playlist','playlist':arr,"actualPlaylist":actualPlaylist});
});
app.post("/playfile/*", function(req, res){
	//console.log('#240=',req.params);
	var param = req.params[0];
	//console.log('#242=',param);
	var dir   = execSync("egrep -v '(^#|^\s*$|^\s*\t*#)' /etc/mpd.conf | grep playlist_directory | awk '{print $2}' | tr --delete '\"'").pars();
	//console.log('#244=',dir);
	var playlists   = getFiles(dir);
	var txt   = readHTMLfile(dir+'/'+param+'.m3u');
	var playfiles = txt.split("\n");
	playfiles.length = playfiles.length-1; 
	playfiles.forEach(function(v,k){
		//console.log(k,v);
		playfiles[k]=v.replace(param+'/','');
	});
	console.log(playfiles.length);
	
	sendInfo(res,{'type':'playfiles','playfiles':playfiles,'playlists':playlists,"actualPlaylist":actualPlaylist});
});




app.post("/radio/*", function(req, res){
	var param=req.params[0];
	if (param=="0") param="stop";
	var mpcexe = "mpc play "+param;
	if (param=="stop" || param=="play" || param=="current" || param=="next" || param=="prev" || param=="pause"|| param=="playlist" ) mpcexe = "mpc "+param;
	if (param=="info") mpcexe = "mpc";
	if (param=="seek") mpcexe = "mpc seek +20%";
	//console.log('/237 radio PARAM=',param,mpcexe);
		try {
			var info = execSync(mpcexe).pars();
		} catch(err) {
			var info = err.stderr.toString();
			//console.log("\nstdout===");					console.log(err.stdout.toString());
			//console.log("\nstderr===");					console.log(err.stderr.toString());
		}
	var ret  = parseMpcInfo(info);
	sendInfo(res,ret);
});

app.post("/vol/*", function(req, res){
	var param=req.params[0];
	//console.log(param)
	var info=execSync("mpc volume "+param).pars();
	var ret = parseMpcInfo(info);
	sendInfo(res,ret);
});

app.post("/volume/*", function(req, res){
	var param=req.params[0];
	if (parseInt(param) >0) param = "+"+param;
	if (parseInt(param) ===0) param = "85";
	//console.log(param)
	//console.log("/232 POST VOLUME PARAM=",typeof(param),param,parseInt(param));
	//if (parseInt(param)>100) param='100';
	//if (parseInt(param)<30) param='30';
	//console.log("/163 VOLUME PARAM=",typeof(param),param,parseInt(param));
	var info=execSync("mpc volume "+param).pars();
	var ret = parseMpcInfo(info);
	sendInfo(res,ret);
});


/*
app.post("/seek/*", function(req, res){
	var param=req.params[0];
	//console.log("/143 SEEK PARAM=",typeof(param),param);
	//var info=execSync("mpc seek "+param+"%").pars();
	var info=execSync("mpc seek +20%").pars();
	var ret = parseMpcInfo(info);
	sendInfo(res,ret);
});
*/

app.post("/random/*", function(req, res){
	var param=req.params[0];
	//console.log(param)
	var info=execSync("mpc random "+param).pars();
	var ret = parseMpcInfo(info);
	sendInfo(res,ret);
});

app.post("/repeat/*", function(req, res){
	var param=req.params[0];
	//console.log(param)
	var info=execSync("mpc repeat "+param).pars();
	var ret = parseMpcInfo(info);
	sendInfo(res,ret);
});

app.post("/single/*", function(req, res){
	var param=req.params[0];
	//console.log(param)
	var info=execSync("mpc single "+param).pars();
	var ret = parseMpcInfo(info);
	sendInfo(res,ret);
});

app.post("/folder/*", function(req, res){
	var username = __dirname.split(DS)[2];
	var param=req.params[0];
	var command = [];
	if (param) {
		actualPlaylist = param;
		command.push("mpc stop");
		command.push("mpc clear");
		command.push("mpc load "+param);
		command.push("mpc play 1");
		if (param == "random") command.push("mpc random on"); else command.push("mpc random off");
	}
	//console.log("#253 PARAM=",param,username,command);
	var info ="";
	if (command[0]) info=execSync(command[0]).pars();
	if (command[1]) info=execSync(command[1]).pars();
	if (command[2]) info=execSync(command[2]).pars();
	if (command[3]) info=execSync(command[3]).pars();
	var ret = parseMpcInfo(info);
	sendInfo(res,ret);
});

app.post("/system/*", function(req, res){
	var param=req.params[0];
	console.log("#323=system=",param)
	var info=execSync('sudo '+param).pars();
	var ret = parseMpcInfo(info);
	sendInfo(res,ret);
});

server.listen(port);

console.log("~~~EXPRESS.JS~~~//:"+port+"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
setTimeout(function(){console.log("myIP="+myIP,"debug="+debug,"args=",args);},750);





