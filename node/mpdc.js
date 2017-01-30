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
	//client.sendCommand(cmd("play", [nr]), 
	client.sendCommand(cmd("currentsong", []), 
	
		function(err, msg) {
			if (err) throw err;
			console.log('\n\n--------Interval cmd=',nr);
			console.log(typeof(msg));
			console.log(msg);
			var arr = msg.split("\n");
			console.log(typeof(arr));
			console.log(arr);
			var info ={}
			for (var k in arr){
				if (arr[k]){
					var inf = arr[k].split(": ");
					info[inf[0]] = (inf[1]);
				}
			}
			console.log(info);
			console.log('.................................................');
			console.log(info.Artist, ':: ',info.Album , ': ',info.Title , '\n# ',info.file );
			console.log('.................................................');
		});
},15000);



