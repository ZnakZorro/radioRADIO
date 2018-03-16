var stream = require('stream');
//var EventEmitter = require('events').EventEmitter;
//var emitter = new EventEmitter();
//const fs = require('fs');
var jpeg = require('jpeg-js');

var Campi = require('campi');
var campi = new Campi();
var mess=null;
var buff = [];


var klik = function(){
	//console.log((new Date()).toLocaleString());	
	var startt = (new Date()).getTime();
	campi.getImageAsStream({
		width: 60,
		height: 40,
		nopreview: true,
		timeout: 1,
		//hflip: true,
		//vflip: true
	}, function (err, stream) {
		if (err) {throw err;}	
			stream.on('end', function (d) {
				var stopt = (new Date()).getTime();
				//console.log((new Date()).toLocaleString());
				console.log('\nsnap end ------------',(new Date()).toLocaleString());
				var buf = Buffer.concat(buff);
				//console.log(typeof(buf),buf.length);
				var rawImageData = jpeg.decode(buf);
				var w = rawImageData.width;
				var h = rawImageData.height;
				var dane = rawImageData.data;
				//console.log(w+'x'+h,dane.length);
				//console.log(dane);
				//fs.writeFile('0.txt', mess,function(r){console.log(r)});  
					var rr=0;
					var gg=0;
					var bb=0;

					for (var y=0; y<h; y++ ){
						for (var x=0; x<w; x++ ){
							var i = (y*w*4)+(x*4);
							var r = dane[i+0];
							var g = dane[i+1];
							var b = dane[i+2];
							var a = dane[i+3];
							rr+=r;
							gg+=g;
							bb+=g;
							//if (y==0) console.log(y,x,r,g,b,a);
						}						
					}
					var p = w*h;
					//console.log(rr,gg,bb);
					
					var mid = Math.round((rr+gg+bb)/(3*p));
					var procent = Math.round(mid/2.55);
					console.log(procent+'%  mid='+mid,(stopt-startt)+'ms',w+'x'+h,' rgb='+Math.round(rr/p),Math.round(gg/p),Math.round(bb/p));			
			});
			
			stream.on('data', function (d) {
				//console.log(typeof(d),d.length);
				//mess += d;
				buff.push(d)
			})
	});

}

klik();
setInterval(klik,60000);


