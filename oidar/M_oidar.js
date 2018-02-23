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
div {float:left; margin:0.25% 1%; padding:0.5%; width:96%;}
div.klawisze  {background:#f4f4f4;}
div.container {width:91%; margin:1% 3%; border:1px solid #ddd; background:#f0f0f0;  border-radius:0.5em;}
a {float:left; text-decoration:none; color:#124; border:1px solid gray; background:#e0e0e0; padding:0.5em; margin:0.5em; border-radius:0.5em;}
</style>
</head>
<body>
`;
},

div: function(id,wpis) {
	return `<div id="${id}">${wpis}</div>`;
},

footer: function(wpis) {
	return `<div><hr />${wpis}</div></body></html>`;
}
  

};
