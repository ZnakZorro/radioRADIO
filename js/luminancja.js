function luminacja(rgb){
	for (var c in rgb){
		var v = rgb[c] / 255;
		if (v <= 0.03928) v = v/12.92; else v = Math.pow(((v+0.055)/1.055),2.4);
		rgb[c]=v;
	};
	var L = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
	return L;
}


console.log(luminacja([0,0,0]));
console.log(luminacja([255,255,255]));
console.log(luminacja([255,0,0]));
console.log(luminacja([0,255,0]));
console.log(luminacja([0,0,255]));
console.log(luminacja([255,0,255]));
console.log(luminacja([0,255,255]));


/*
for each c in r,g,b:
    c = c / 255.0
    if c <= 0.03928 then c = c/12.92 else c = ((c+0.055)/1.055) ^ 2.4
L = 0.2126 * r + 0.7152 * g + 0.0722 * b
*/
