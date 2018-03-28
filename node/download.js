#!/usr/local/bin/node
"use strict"; 
const DS = '/';
const DOWNLOAD_DIR = '/home/pi/app/arch/';
const moddir      = '/usr/local/lib/node_modules/';
const exec = require("child_process").exec;
const spawn = require("child_process").spawn;

	const http = require('http');
	const path = require('path');
	const fs = require('fs');
	const url = require('url');


// Function to download file using wget
var download_file_wget = function(file_url) {
    // extract the file name
    var file_name = url.parse(file_url).pathname.split('/').pop();
    // compose the wget command
    var rm = 'rm -f ' + DOWNLOAD_DIR + file_name;
    var wget = 'wget -P ' + DOWNLOAD_DIR + ' ' + file_url;
	//console.log(9,rm)
    // excute wget using child_process' exec function
		exec(rm, function(err, stdout, stderr) {
			//console.log(('---',err, stdout, stderr))
			var child = exec(wget, function(err, stdout, stderr) {
				if (err) throw err;
				else console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
			});
		});
};



// Function to download file using curl
var download_file_curl = function(file_url) {
    // extract the file name
    var file_name = url.parse(file_url).pathname.split('/').pop();
    // create an instance of writable stream
    var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);
    // execute curl using child_process' spawn function
    var curl = spawn('curl', [file_url]);
    // add a 'data' event listener for the spawn instance
    curl.stdout.on('data', function(data) { file.write(data); });
    // add an 'end' event listener to close the writeable stream
    curl.stdout.on('end', function(data) {
        file.end();
        console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
    });
    // when the spawn child process exits, check if there were any errors and close the writeable stream
    curl.on('exit', function(code) {
        if (code != 0) {
            console.log('Failed: ' + code);
        }
    });
};


/*

// dowload by http
var hfile_url = 'https://www.wi.zut.edu.pl/templates/wizut/assets/images/logo/zut-logo-1.jpg';


// We will be downloading the files to a directory, so make sure it's there
// This step is not required if you have manually created the directory
var mkdir = 'mkdir -p ' + DOWNLOAD_DIR;
var child = exec(mkdir, function(err, stdout, stderr) {
    if (err) throw err;
    else download_file_httpget(hfile_url);
});

// Function to download file using HTTP.get
var download_file_httpget = function(hfile_url) {
var options = {
    host: url.parse(hfile_url).host,
    port: 80,
    path: url.parse(hfile_url).pathname
};

var file_name = url.parse(hfile_url).pathname.split('/').pop();
var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

http.get(options, function(res) {
    res.on('data', function(data) {
            file.write(data);
        }).on('end', function() {
            file.end();
            console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
        });
    });
};
*/

let serverURLs = [
'https://raw.githubusercontent.com/ZnakZorro/radioRADIO/master/radio.json',
'https://raw.githubusercontent.com/ZnakZorro/radioRADIO/master/rss.js',
'https://raw.githubusercontent.com/ZnakZorro/radioRADIO/master/server.js',
'https://raw.githubusercontent.com/ZnakZorro/radioRADIO/master/index.js',
'https://raw.githubusercontent.com/ZnakZorro/radioRADIO/master/index.html',
'https://raw.githubusercontent.com/ZnakZorro/radioRADIO/master/node/sos.js',
'https://raw.githubusercontent.com/ZnakZorro/radioRADIO/master/node/cam/one.js'
];

serverURLs.forEach(function(serverURL,i){
		console.log(i,'---',serverURL);
		download_file_wget(serverURL);
	});
//download_file_curl(serverURL);

