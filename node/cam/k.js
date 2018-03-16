let stream = require('stream');
//let EventEmitter = require('events').EventEmitter;
//let emitter = new EventEmitter();
//const fs = require('fs');
app = require('express')(),
http = require('http').Server(app),
io = require('socket.io')(http),
base64 = require('base64-stream');
arr64 = require('base64-arraybuffer');



app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
	//setTimeout(klik,1000);
});


let jpeg = require('jpeg-js');
let Campi = require('campi');

let mess=null;



let klik = function(){
	let buff = [];
	//console.log((new Date()).toLocaleString());	
	let startt = (new Date()).getTime();
	let campi = new Campi();
	campi.getImageAsStream({
		width: 60,
		height: 40,
		nopreview: true,
		timeout: 1,
		hflip: true,
		//vflip: true
	}, function (err, stream) {
		if (err) {throw err;}	
			stream.on('end', function (d) {
				let stopt = (new Date()).getTime();
				//console.log((new Date()).toLocaleString());
				console.log('\nsnap end ------------',(new Date()).toLocaleString());
				let buf = Buffer.concat(buff);
				//console.log(typeof(buf),buf.length);
				let rawImageData = jpeg.decode(buf);
				let w = rawImageData.width;
				let h = rawImageData.height;
				let dane = rawImageData.data;
				//console.log(w+'x'+h,dane.length);
				//console.log(dane);
				//fs.writeFile('0.txt', mess,function(r){console.log(r)});  
					let rr=0;
					let gg=0;
					let bb=0;
					let arr = [];
					for(let i=0;i<4; i++) {arr[i] = []; for(let z=0;z<6;z++)arr[i][z]=0;};
					//console.log('#50=',arr)
					
					
					for (let y=0; y<h; y++ ){
						let iy = Math.floor(y/10);
						for (let x=0; x<w; x++ ){
							let i = (y*w*4)+(x*4);
							let ix = Math.floor(x/10);
							
							let r = dane[i+0];
							let g = dane[i+1];
							let b = dane[i+2];
							let a = dane[i+3];
							rr+=r;
							gg+=g;
							bb+=g;
							//if (!arr[iy][0]) arr[iy]=[];
							arr[iy][ix] += g;
							//if (y==0) console.log(y,x,r,g,b,a);
						}						
					}
					let p = w*h;
					console.log(rr,gg,bb);
					
					let mid = Math.round((rr+gg+bb)/(3*p));
					let procent = Math.round(mid/2.55);
					console.log(procent+'%  mid='+mid,(stopt-startt)+'ms',w+'x'+h,' rgb='+Math.round(rr/p),Math.round(gg/p),Math.round(bb/p));			
					//delete campi;
					let min =arr[0][0];
					let max =arr[0][0];
					arr.forEach(function(y,x){
						y.forEach(function(yy,xx){
							//console.log(x,xx,yy);
							min=Math.min(min,arr[x][xx]);
							max=Math.max(max,arr[x][xx]);
						})
					})
					//console.log(arr)
					console.log('min max=',min,max);
					arr.forEach(function(y,x){
						y.forEach(function(yy,xx){
							arr[x][xx] = Math.round(255*((arr[x][xx]-min)/(max-min))); 
						})
					})
					//console.log(arr);
					let bufor = arr64.encode(buf);
					
					let message = JSON.stringify({"tablica":arr,"image":bufor});
					io.sockets.emit('tablica', message);
					setTimeout(klik,10);
			});

			stream.on('data', function (d) {
				//console.log(typeof(d),d.length);
				//mess += d;
				buff.push(d)
			})
	});
	//
}// klik

//klik();
//setTimeout(klik,10);

http.listen(3000, function () {
	klik()
	console.log('/:3000\n')
});
