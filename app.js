var ping = require ("net-ping");
var http = require('http');
const powerhost = '192.168.10.15';

var options = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 16,
    retries: 3,
    sessionId: (process.pid % 65535),
    timeout: 2000,
    ttl: 128
};

var tenMinutes = 10*60*1000;
var tenSeconds = 10*1000;

var session = ping.createSession (options);

function pingGoogle() {
  session.pingHost('8.8.8.8', function (error, target) {
    if (error) {
      restartModem(0);
    } else {
      console.log('success');
      setTimeout(pingGoogle, tenMinutes);
    }
  });
}

function restartModem(action) {
  http.get({
    hostname: powerhost,
    port: 8000,
    path: '/?group=10000&switch=02&action=' + action,
    agent: false  // create a new agent just for this one request
  }, (res) => {
    if (action === 0) {
      setTimeout(() => {restartModem(1)}, tenSeconds);
      setTimeout(pingGoogle, tenMinutes);
    }
  }, (err) => {
    console.log(err);
  });
}

function notifyAboutRestart() {

}

pingGoogle();