function $(id){return document.getElementById(id);}




Object.prototype.clone = Array.prototype.clone = function()
{
    if (Object.prototype.toString.call(this) === '[object Array]')
    {
        var clone = [];
        for (var i=0; i<this.length; i++)
            clone[i] = this[i].clone();

        return clone;
    } 
    else if (typeof(this)=="object")
    {
        var clone = {};
        for (var prop in this)
            if (this.hasOwnProperty(prop))
                clone[prop] = this[prop].clone();

        return clone;
    }
    else
        return this;
}


function copyImageData(ctx, src){
    var dst = ctx.createImageData(src.width, src.height);
    dst.data.set(src.data);
    return dst;
}

var imgMan={
	_ctx : null,
	_imageData : null,
	__imageData : null,
		

	load: function (ctx,imageData){
		ctx = ctx || this._ctx;
		imageData = imageData || this._imageData;
		imageData = ctx.getImageData(0, 0, imageData.width,imageData.height);
		this._imageData = imageData;
		this.__imageData = copyImageData(ctx, imageData);
		ctx.putImageData(this.__imageData, 0, 0);		
	},
	reload: function (ctx){
		ctx = ctx || this._ctx;
		this._imageData  = copyImageData(ctx, this.__imageData);
		ctx.putImageData(this._imageData, 0, 0);
	},
	negative: function (ctx,imageData){
		ctx = ctx || this._ctx;
		imageData = imageData || this._imageData;
		imageData = ctx.getImageData(0, 0, imageData.width,imageData.height);
		var data = imageData.data;
		for(var i = 0; i < data.length; i += 4) {
			data[i] = 255 - data[i];// red
			data[i + 1] = 255 - data[i + 1];// green
			data[i + 2] = 255 - data[i + 2];// blue
		}
		ctx.putImageData(imageData, 0, 0);
	},
	_darker: function (x){var y=Math.round(x*0.9); return (y>0) ? y : 0;},
	darker: function (ctx,imageData){
		ctx = ctx || this._ctx;
		imageData = imageData || this._imageData;
		imageData = ctx.getImageData(0, 0, imageData.width,imageData.height);
		var data = imageData.data;
		for(var i = 0; i < data.length; i += 4) {
			data[i]   = this._darker(data[i]);
			data[i+1] = this._darker(data[i+1]);
			data[i+2] = this._darker(data[i+2]);
		}
		ctx.putImageData(imageData, 0, 0);
	},
	_lighter: function (x){var y=Math.round(x*1.1); return (y<256) ? y : 255;},
	lighter: function (ctx,imageData){
		ctx = ctx || this._ctx;
		imageData = imageData || this._imageData;
		imageData = ctx.getImageData(0, 0, imageData.width,imageData.height);
		var data = imageData.data;
		for(var i = 0; i < data.length; i += 4) {
			data[i]   = this._lighter(data[i]);
			data[i+1] = this._lighter(data[i+1]);
			data[i+2] = this._lighter(data[i+2]);
		}
		ctx.putImageData(imageData, 0, 0);
	}
}


imgMan._gray = function(r,g,b) {
   return (0.2126*r + 0.7152*g + 0.0722*b);
}

imgMan.grayscale = function(ctx,imageData) {
	ctx = ctx || this._ctx;
	imageData = imageData || this._imageData;
	imageData = ctx.getImageData(0, 0, imageData.width,imageData.height);
	var d = imageData.data;
	for (var i=0; i<d.length; i+=4) {
		d[i] = d[i+1] = d[i+2] = this._gray(d[i],d[i+1],d[i+2]);
	}
	ctx.putImageData(imageData, 0, 0);
};


imgMan.threshold = function(ctx,imageData,threshold) {
	ctx = ctx || this._ctx;
	imageData = imageData || this._imageData;
	imageData = ctx.getImageData(0, 0, imageData.width,imageData.height);
	var d = imageData.data;
	for (var i=0; i<d.length; i+=4) {
		var v = (this._gray(d[i],d[i+1],d[i+2]) >= threshold) ? 255 : 0;
		d[i] = d[i+1] = d[i+2] = v
	}
	ctx.putImageData(imageData, 0, 0);
};





/*?????????????????*/


imgMan.sharpen = function(ctx,imageData) {
	ctx = ctx || this._ctx;
	imageData = imageData || this._imageData;
	imageData = ctx.getImageData(0, 0, imageData.width,imageData.height);
	var o = imgMan.convolute(imageData,
	[  0, -1,  0,
	-1,  5, -1,
	0, -1,  0 ]
	);
	ctx.putImageData(o, 0, 0);
}
imgMan.blur = function(ctx,imageData) {
	ctx = ctx || this._ctx;
	imageData = imageData || this._imageData;
	imageData = ctx.getImageData(0, 0, imageData.width,imageData.height);
	var o = imgMan.convolute(imageData,
	[ 1/9, 1/9, 1/9,
    1/9, 1/9, 1/9,
    1/9, 1/9, 1/9 ]
	);
	ctx.putImageData(o, 0, 0);
}
imgMan.ciach1 = function(ctx,imageData) {
	ctx = ctx || this._ctx;
	imageData = imageData || this._imageData;
	imageData = ctx.getImageData(0, 0, imageData.width,imageData.height);
	var o = imgMan.convolute(imageData,
	[  0, -1,  0,
	  -1,  6, -1,
	   0, -1,  0 ]	
	);
	ctx.putImageData(o, 0, 0);
}
imgMan.ciach2 = function(ctx,imageData) {
	ctx = ctx || this._ctx;
	imageData = imageData || this._imageData;
	imageData = ctx.getImageData(0, 0, imageData.width,imageData.height);
	var o = imgMan.convolute(imageData,
	[  0, -1,  0,
	  -1,  7, -1,
	   0, -1,  0 ]	
	);
	ctx.putImageData(o, 0, 0);
}
imgMan.ciach3 = function(ctx,imageData) {
	ctx = ctx || this._ctx;
	imageData = imageData || this._imageData;
	imageData = ctx.getImageData(0, 0, imageData.width,imageData.height);
	var o = imgMan.convolute(imageData,
	[  0, -1,  0,
	  -1,  8, -1,
	   0, -1,  0 ]	
/*	
	[ -1, -2, -1,
    0,  0,  0,
    1,  2,  1 ]
	
	[  0, -1,  0,
	  -1,  5, -1,
	   0, -1,  0 ]	
*/
	);
	ctx.putImageData(o, 0, 0);
}



imgMan.tmpCanvas = document.createElement('canvas');
imgMan.tmpCtx = imgMan.tmpCanvas.getContext('2d');

imgMan.createImageData = function(w,h) {
  return this.tmpCtx.createImageData(w,h);
};

imgMan.convolute = function(pixels, weights, opaque) {
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side/2);
  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;
  // pad output by the convolution matrix
  var w = sw;
  var h = sh;
  var output = imgMan.createImageData(w, h);
  var dst = output.data;
  // go through the destination image pixels
  var alphaFac = opaque ? 1 : 0;
  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      // calculate the weighed sum of the source image pixels that
      // fall under the convolution matrix
      var r=0, g=0, b=0, a=0;
      for (var cy=0; cy<side; cy++) {
        for (var cx=0; cx<side; cx++) {
          var scy = sy + cy - halfSide;
          var scx = sx + cx - halfSide;
          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            var srcOff = (scy*sw+scx)*4;
            var wt = weights[cy*side+cx];
            r += src[srcOff] * wt;
            g += src[srcOff+1] * wt;
            b += src[srcOff+2] * wt;
            a += src[srcOff+3] * wt;
          }
        }
      }
      dst[dstOff] = r;
      dst[dstOff+1] = g;
      dst[dstOff+2] = b;
      dst[dstOff+3] = a + alphaFac*(255-a);
    }
  }
  return output;
};

/*
imgMan.getPixels = function(img) {
	var ctx=this._ctx;
	//var imageData = this._imageData;
	//var d = imageData.data;
  //var c = this.getCanvas(img.width, img.height);
  //var ctx = c.getContext('2d');
  ctx.drawImage(img,0,0);
	//ctx = ctx || this._ctx;
	//imageData = imageData || this._imageData;
	//var d = imageData.data;  
  return ctx.getImageData(0,0,c.width,c.height);
};

imgMan.getCanvas = function(w,h) {
  var c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};


imgMan.filterImage = function(filter, image, var_args) {
  var args = [this.getPixels(image)];
  for (var i=2; i<arguments.length; i++) {
    args.push(arguments[i]);
  }
  return filter.apply(null, args);
};
*/

