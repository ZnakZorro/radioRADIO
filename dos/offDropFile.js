
var imgMan={
	negative: function (ctx,imageData){
		var data = imageData.data;
		for(var i = 0; i < data.length; i += 4) {
			data[i] = 255 - data[i];// red
			data[i + 1] = 255 - data[i + 1];// green
			data[i + 2] = 255 - data[i + 2];// blue
		}
		ctx.putImageData(imageData, 0, 0);
	},
	darker: function (ctx,imageData){
		var data = imageData.data;
		for(var i = 0; i < data.length; i += 4) {
			data[i] = Math.round(data[i]*0.9);
			data[i+1] = Math.round(data[i+1]*0.9);
			data[i+2] = Math.round(data[i+2]*0.9);
		}
		ctx.putImageData(imageData, 0, 0);
	},
	_lighter: function (x){var y=Math.round(x*1.1); return (y<256) ? y : 255;},
	lighter: function (ctx,imageData){
		var data = imageData.data;
		for(var i = 0; i < data.length; i += 4) {
			data[i]   = this._lighter(data[i]);
			data[i+1] = this._lighter(data[i+1]);
			data[i+2] = this._lighter(data[i+2]);
		}
		ctx.putImageData(imageData, 0, 0);
	}
}
