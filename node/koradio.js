#!/usr/local/bin/node
"use strict";
const execSync = require("child_process").execSync;
const _ = require('/usr/local/lib/node_modules/koa-route');
const serve = require('/usr/local/lib/node_modules/koa-static');
const Koa = require('/usr/local/lib/node_modules/koa');
const app = new Koa();

const db = {
  0: { name: 'kici', species: 'kotek' },
  1: { name: 'tobi', species: 'ferret' },
  2: { name: 'loki', species: 'ferret' },
  3: { name: 'jane', species: 'ferret' }
};

const radio = {
	info: (ctx) => {
		 console.log('info')
	let info = execSync("mpc").toString();
    ctx.body = info;
  },
  list: (ctx) => {
	  console.log('list')
    const names = Object.keys(db);
    ctx.body = 'radio: ' + names.join(', ');
  },

  show: (ctx, name) => {
	   console.log('show')
	  //console.log(2,ctx.status)
	  let info=execSync("mpc current").toString();
    const pet = db[name];
    if (!pet) return ctx.throw('cannot find that pet', 404);
    ctx.body = info+pet.name + ' is a ' + pet.species;
  },
  play: (ctx, name) => {
	console.log('play=',name)
	let info=execSync("mpc play "+name).toString();
    ctx.body = info;
  }  
};

app.use(serve(__dirname + '/public'));
app.use(_.post('/info', radio.info));
app.use(_.get('/info', radio.info));
app.use(_.get('/radio', radio.list));
app.use(_.get('/radio/:name', radio.play));
app.use(_.post('/radio/:name', radio.play));
app.use(_.get('/radio/play/:name', radio.play));

app.listen(8008);
console.log('listening on port 8008');
