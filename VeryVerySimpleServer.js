let http = require('http');
http.createServer(function (req, res) {
  let params = req.url.split('/').slice(1);
  console.log(params);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<h1>Hello World!<h1>');
  if (params[0]) res.write('<h2>'+params[0]+'</h2>');
  if (params[1]) res.write('<h3>'+params[1]+'</h3>');
  res.end();
}).listen(4444,function(){console.log('Server running at 127.0.0.1:4444');});


