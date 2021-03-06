#!/usr/local/bin/node
"use strict";
const moddir      = "/usr/local/lib/node_modules/";
const request     = require(moddir+"request");
const FeedParser  = require(moddir+"feedparser");
const testurlFeed = "http://www.guardian.co.uk/world/usa/rss";
const fs          = require('fs');

var rssFile       = __dirname+'/public/rss.html';

var outMENU = '<br /><a name="top" />\n';

var cacheSecounds 	= 6*300;	// secounds 300= 5 minut 
var rssHours 		= 6; 	// hours


//console.log(rssFile)

const rssy = [
	{"title":"Wiadomości","url":"https://www.bankier.pl/rss/wiadomosci.xml"},
	{"title":"Finanse","url":"https://www.bankier.pl/rss/finanse.xml"},
	//{"title":"Firma","url":"https://www.bankier.pl/rss/firma.xml"},
	{"title":"Giełda","url":"https://www.bankier.pl/rss/gielda.xml"},
	{"title":"Waluty","url":"https://www.bankier.pl/rss/waluty.xml"},
	//{"title":"Spółki","url":"https://www.bankier.pl/rss/espi.xml"},
	{"title":"HackOfTheDay","url":"https://hackaday.com/blog/feed/"},
	{"title":"PAP","url":"http://www.pap.pl/API/pl/Cms.Informations/Rss/1159/0"},
];
//console.log(rssy);

function getFeed (urlfeed, callback) {
	var req = request (urlfeed);
	var feedparser = new FeedParser ();
	var feedItems = new Array ();
	req.on ("response", function (response) {
		var stream = this;
		if (response.statusCode == 200) {
			stream.pipe (feedparser);
			}
		});
	req.on ("error", function (err) {
		console.log ("getFeed: err.message == " + err.message);
		});
	feedparser.on ("readable", function () {
		try {
			var item = this.read (), flnew;
			if (item !== null) { //2/9/17 by DW
				feedItems.push (item);
				}
			}
		catch (err) {
			console.log ("getFeed: err.message == " + err.message);
			}
		});
	feedparser.on ("end", function () {
		callback (undefined, feedItems);
		});
	feedparser.on ("error", function (err) {
		console.log ("getFeed: err.message == " + err.message);
		callback (err);
		});
	}
		function pad (num) { 
			var s = num.toString (), ctplaces = 4;
			while (s.length < ctplaces) {
				s = "0" + s;
				}
			return (s);
			}
//console.log ("\n" + myProductName + " v" + myVersion + ".\n"); 

/*=======================================*/
function readRSSY(res){
	readRSSYfromWWW(res);
}			

function readRSSYfromWWW(res){	
	let artCount=1;
		rssy.forEach(function(item,y){
			//console.log('#80=',y,item.title,item.url);
			outMENU += '<a href="#'+item.title+'"><span class="menu">'+item.title+'</span></a>\n';
			//console.log('#102=',outMENU);
			let urlTestFeed = item.url;
			
			getFeed (urlTestFeed, function (err, feedItems) {
			if (!err) {
				let teraz = (new Date()).toLocaleString();
				let now   = (new Date()).getTime();
				let outHTML ='';
				//console.log ("<h2>"+item.title+"</h2>\n");
				outHTML+='<div class="rss" title="'+item.title+'"><a name="'+item.title+'"/>\n';
				outHTML+='<a href="#top"><h2> &uArr; '+item.title+'</h2></a>\n';
				//console.log ("There are " + feedItems.length + " items in the feed.\n");
				for (var i = 0; i < feedItems.length; i++) {
					//title,description,summary,date,pubdate,pubDate,link,guid,author,
					//console.log ("#" +pad(i)+"\n<h3>"+feedItems[i].title+"</h3>\n<div>"+feedItems[i].summary+".</div>\n\n");
					let pub   = (new Date(feedItems[i].date)).getTime();
					let delta = Math.round((now-pub)/3600000); // w godzinach
					if (delta>100) delta = 0;
					//console.log ("#121=", item.title, delta,rssHours,feedItems[i].date);
					if (item.title != 'PAP' && delta>rssHours) continue;
					//console.log(now,pub,delta);
					let czas  = (new Date(feedItems[i].date)).toLocaleString();// || (new Date(feedItems[i].pubdate)).toLocaleString() || (new Date(feedItems[i].pubDate)).toLocaleString();
					outHTML+='<!--#' +pad(i)+'-->\n';
					outHTML+='<div data-delta="'+delta+'">';
						outHTML+='<a href="'+feedItems[i].link+'" title="Link" target="_blank"><h3>'+artCount+'. '+' <small>['+delta+'h]</small> '+feedItems[i].title+'</h3></a>\n';
						//outHTML+='<span class="czas">'+czas+' ['+delta+']</span>\n';
						outHTML+=feedItems[i].summary;
					outHTML+='</div>\n\n';
					artCount++;
					}
					outHTML +='</div>\n';
					finishRSS(res,outHTML,y,rssy.length);
				}
				
			}); // getFeed
			
		});
}			
	
var startHTML ='<html><head>\n';	
	startHTML +='<meta charset="utf-8">\n';	
	startHTML +='<meta name="viewport" content="width=device-width,initial-scale=1">\n';
	startHTML +='<link rel="shortcut icon" href="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAcVMRQNGjO/zhqz/84as//OGrP/zhqz/84as//OGrP/zhqz/84as//OGrP/zhqz/84as//OGrP/zRozv8cVMRQM2fO/x5b0v8eW9L/HlvS/x5b0v8eW9L/HlvS/x5b0v8eW9L/HlvS/x5b0v8eW9L/HlvS/x5b0v8eW9L/M2fO/y9m0P8dW9T/GlzY/4Kq7/+Vs+v/HVvU/x1b1P8cXNb/m7jv/x1b1P8dW9T/HVvU/xlc2f8dW9T/HVvU/y9m0P8pY9H/G1zX/4Gx/v///////////5Cy6P8bXNf/E2bv//////90nuP/G1zX/xRe4v/g7P//n7zs/xpc1/8pY9H/I2DT/xdd3f+Bsf7///////////+Xt+r/GFzZ/zWA+P//////ToTb/xld2/8QX+f//////6bB7f8YXNn/I2DT/x5e1P8WXd7/FF7h/5W48f+Xt+r/E1rP/xRe4P/Y5////////xNb0f8WXd7/GGvz//////9rmOD/Fl3e/x5e1P8ZW9X/FF7i/xRe4v8UXuL/E17g/xRe4v9xqP3//////4mt5v8UXt//FF7i/1qZ/P//////MG/W/xRe4v8ZW9X/FlrV/xFf5v8RX+b/FmXp/zp/8f/Y5////////9Lg9v8ZYtr/EV/m/wxg7P/3+v//8PX8/xJd2P8RX+b/FlrV/xdb1/8OYOr/kLv+/////////////////4it5/8YYtz/D2Dp/w9g6f9xp/7//////06D2v8PYOj/D2Dp/xdb1/8bXtf/DGHt/whi8/94pOr/TIXe/xFc1f8NYOj/DGHt/wxh7f8ygPz//////+Hr+f8QXNn/DGHt/wxh7f8bXtf/IGLZ/wph8f8KYfH/CmHx/wph8f8KYfH/CmHx/wph8v9xp/3///////////8SWs7/CmHx/wph8f8KYfH/IGLZ/yVm2v8IYvT/CGL0/whi9P8IYvT/Fmz2/1uZ+//3+v///////+Hr+v8SW8//CGL0/whi9P8IYvT/CGL0/yVm2v8ratv/BmP4/wRj+v/g7P//////////////////8PX+/06D2v8OXt3/BmP4/wZj+P8GY/j/BmP4/wZj+P8ratv/MG7c/wRj+/8EY/v/nb7y/6bC7/9qmeP/LnDa/wxe4f8EY/n/BGP7/wRj+/8EY/v/BGP7/wRj+/8EY/v/MG7c/zJw3f8CZP3/AmT9/wJk/f8EY/f/AmT9/wJk/f8CZP3/AmT9/wJk/f8CZP3/AmT9/wJk/f8CZP3/AmT9/zJw3f8cVMRQM3He/zh03v84dN7/OHTe/zh03v84dN7/OHTe/zh03v84dN7/OHTe/zh03v84dN7/OHTe/zNx3v8cVMRQgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAEAAA==" />';	
	startHTML +='<title>RSSy</title>\n';	
	startHTML +='<style>\n';
		startHTML +='body {font:normal 11pt verdana; margin:0.75em;; padding:0;}\n';
		startHTML +='a {text-decoration:none; color:#126}\n';
		startHTML +='p {margin:0 0 0.25em;}\n';
		startHTML +='h3 {margin:0.5em 0 0 0}\n';
		startHTML +='h2 {clear: both; margin-top:0.2em;padding-top:1.0em;}\n';
		startHTML +='div.nav{float:left; display:block; width:100%; background:#eee; font-size:1.25rem; padding:0.33rem; margin-bottom:1em;}\n';
		startHTML +='div.nav span {float: left;margin: 0.3em;background: #ffffff;border: 1px solid gray;padding: 0.3em 0.7em;border-radius: 0.5em;}\n';
	startHTML +='</style>\n';
	startHTML +='</head>\n<body>\n\n';
	
var stopHTML ='\n</body>\n</html>\n';
	
	
var outALL ='';

var licznik =0;	

function finishRSS(res,out,y,ile){
	outALL += out;
	licznik++
	//console.log ('#164 licznik='+licznik,y,ile);	
	if(licznik===ile) {
		var outM = '<div class="nav">'+outMENU+'</div>\n\n';
		//console.log ('#167 outM='+outM);	
		var alesHTML = startHTML+outM+outALL+stopHTML+'<br /><hr /><br />';
		saveToFile(alesHTML);
		
		licznik=0;
	}
}
//readRSSY;




function saveToFile(alesHTML){
	var time = (new Date()).getTime();
	var czas = (new Date()).toLocaleString();
	var dat = '<!--'+time+';'+czas+'-->\n';
	
	fs.writeFile(rssFile, dat+alesHTML, function(err) {
		if(err) {
			return console.log(err);
		}
		//console.log("#179 The file was saved!");
	});
}	

var res=null;
readRSSYfromWWW(res);

//console.log('ffffffffffffffffffffffff\n');

