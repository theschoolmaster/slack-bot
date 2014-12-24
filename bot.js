var apiKey  = process.env.XBOX_API
var xboxApi = require('node-xbox')(apiKey);
var HTTPS = require('https');
var texts = [
    'Are you coming? My battery ubisnabkit to do above the tondo. And',
    'Fish',
    'Can your poco me up',
    'Alol-zgah hayha',
    'Umm. I might need a rode ho lpl',
    'Hi',
    'U Jane fps for toy',
    'Gosh',
    'My battery us dying'
  ]

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0])

  if(request.text){

    // check status of XBoxLive user
    if(RegExp("^!live (.+)", 'i').test(request.text)) {
      var gamertag = RegExp("^!live (.+)", 'i').exec(request.text)[1];
      var that = this
      xboxApi.profile.xuid(gamertag, function(err, returnedXuid){ 
        xboxApi.profile.presence(returnedXuid, function(err, returnedPresence){
          var response = ""
          response += gamertag
          response += " is "
          response += JSON.parse(returnedPresence).state
          that.res.writeHead(200);
          postMessage(response);
          that.res.end();        
        })
      })
    }

    // Resonse to "hello nawbot"
    if(RegExp("^hello nawbot$", 'i').test(request.text)) {
      this.res.writeHead(200);
      postMessage("Very nice of you to think of me.  I was starting to feel neglected");
      this.res.end();
    } 

    // Logan's drunk texts
    if(RegExp("^text logan$", 'i').test(request.text)) {
      rand = Math.floor(Math.random() * texts.length ) 
      this.res.writeHead(200);
      postMessage(texts[rand]);
      this.res.end();
    } 

    else {
      console.log("don't care");
      this.res.writeHead(200);
      this.res.end();
    }
  }

}

function postMessage(msg) {
  var botResponse, options, body, botReq;

  botResponse = msg

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
