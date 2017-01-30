#!/usr/local/bin/node

var mpd = require('/usr/local/lib/node_modules/mpd');
var cmd = mpd.cmd;

var client = mpd.connect({
	port: 6600,
	host: 'localhost',
});

client.on('ready', function() {
	console.log("ready --------------");
});
client.on('system', function(name) {
	console.log("update", name);
});

client.on('system-player', function() {
	client.sendCommand(cmd("status", []), function(err, msg) {
		if (err) throw err;
		console.log('system-player');
		console.log(msg);
	});
});

var nr=33;
setInterval(function(){
	nr++;
	client.sendCommand(cmd("play", [nr]), function(err, msg) {
		if (err) throw err;
		console.log(msg);
		console.log('--------Interval cmd=',nr);
	});
},15000);
