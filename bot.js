var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/cool guy$/;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else if(request.text && RegExp("^text logan$").test(request.text)) {
    var texts = ['Are you coming? My battery ubisnabkit to do above the tondo. And',
                'Fish',
                'Can your poco me up',
                'Alol-zgah hayha',
                'Umm. I might need a rode ho lpl',
                'Hi',
                'U Jane fps for toy',
                'Gosh',
                'My battery us dying'],
        rand = Math.floor(Math.random() * texts.length ) 

    this.res.writeHead(200);
    postMessage(texts[rand]);
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(msg) {
  var botResponse, options, body, botReq;

  botResponse = msg || cool();

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
