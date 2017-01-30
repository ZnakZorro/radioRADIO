#!/usr/local/bin/node

var mpd = require('/usr/local/lib/node_modules/mpd'),
cmd = mpd.cmd;

var client = mpd.connect({
	port: 6600,
	host: 'localhost',
});

client.on('ready', function() {
	console.log("ready");
	cmd('play','32');
});
client.on('system', function(name) {
	console.log("update", name);
});

client.on('system-player', function() {
	client.sendCommand(cmd("status", []), function(err, msg) {
		if (err) throw err;
		console.log(msg);
	});
});

var nr=32;
setInterval(function(){
	cmd('play',nr);
	nr++;
	console.log(nr);
},10000);
