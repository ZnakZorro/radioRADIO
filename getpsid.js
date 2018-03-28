#!/usr/local/bin/node
"use strict"; 
const moddir      = '/usr/local/lib/node_modules/';

const exec = require("child_process").exec;

let execut1 = "ps -ef | grep /app/camera/index.js | grep -v grep | awk '{print $2}'";
let execut2 = "ps ax | grep /app/camera/index.js | grep -v grep | awk '{print $1}'";

exec(execut1,function(a,out,c){
	console.log(out)
})
exec(execut2,function(a,out,c){
	console.log(out)
})
