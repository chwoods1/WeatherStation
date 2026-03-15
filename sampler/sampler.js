let http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Hello World!');
}).listen(8080);


async function sample_data() {
  const sensordata = await fetch("chase-sensor-1/read");
  print(sensordata);
}

function processSample(rawSample) {
  return {
    status: "ok",
  }
}