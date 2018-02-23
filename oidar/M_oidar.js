"use strict";

module.exports = {
	
header: function(title) {
return `<html>
<head>	
<meta charset="utf-8">	
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=" rel="icon" type="image/x-icon" />
<title>${title}</title>	
<style>
body{font:normal 12pt verdana; margin:0.5%;}
div,pre {float:left; margin:0.5% 1%; padding:1%; width:96%;border:1px solid #ddd; border-radius:0.5em; white-space: inherit;}
div#klawisze  {background:#f4f4f4;}
div#container {background:#f0f0f0;}
a {float:left; text-decoration:none; color:#235; border:1px solid gray; background:#e0e0e0; padding:0.5em; margin:0.5em; border-radius:0.5em;}
</style>
</head>
<body>
`;
},

div: function(id,wpis) {
	return `\n<div id="${id}">${wpis}</div>\n`;
},

pre: function(id,wpis) {
	return `\n<pre id="${id}">${wpis}</pre>\n`;
},

footer: function(wpis) {
	return `\n<div>${wpis}</div>\n</body>\n</html>`;
}
  

};
