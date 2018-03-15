var stream = require('stream');
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var Campi = require('campi');
var campi = new Campi();
var mess='';


campi.getImageAsStream({
    width: 640,
    height: 480,
    nopreview: true,
    timeout: 1,
    hflip: true,
    vflip: true
}, function (err, stream) {
    if (err) {throw err;}
	console.log('stream\n');
		
		stream.on('end', function (d) {
			console.log('end');
			//console.log(d);
			console.log(mess);
		});
		
		stream.on('data', function (d) {
			console.log('data==>');
			//console.log(d);
			mess += d.toString();
		})
});



