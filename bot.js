var HTTPS, XBL, slackTeam, slackToken

HTTPS       = require('https')
XBL         = require('./live-api.js')
slackTeam   = process.env.SLACK_TEAM
slackToken  = process.env.SLACK_TOKEN

function respond() {
    var request       = this.req.body,
    // var request       = JSON.parse(this.req.chunks[0]), //dev
        sourceChannel = request.channel_name,
        keyword       = request.trigger_word,
        sourceUser    = request.user_name,
        message       = request.text,
        self          = this

    console.log(request)

    if (request.text) {
        if (keyword == "!live") {
            var gamertag = message.replace(RegExp(keyword + " "), "")
            XBL.getXuid(gamertag)
                .then(XBL.getPresence)
                .then(XBL.prepareResponse)
                .then(function(response){
                    // console.log(response)
                    self.res.writeHead(200)
                    postMessage(response, sourceChannel)
                    self.res.end()
                })
                .catch(function(error) {
                    console.log(error)
                })
        }
    }
}


function postMessage(msg, channel) {
    var botResponse, options, body, botReq

    botResponse = msg

    options = {
        hostname: 'hooks.slack.com',
        path: '/services/'+ slackTeam +'/B03E4RPMW/' + slackToken,
        method: 'POST'
    }

    body = {
        "channel": "#" + channel,
        "username": "xblBot",
        "text": botResponse,
        "icon_emoji": ":video_game:"
    }

    console.log('sending ' + botResponse + ' to Slack channel: #' + channel)

    botReq = HTTPS.request(options, function(res) {
        if (res.statusCode == 200) {
            //neat
        } else {
            console.log('rejecting bad status code ' + res.statusCode)
        }
    })

    botReq.on('error', function(err) {
        console.log('error posting message ' + JSON.stringify(err))
    })
    botReq.on('timeout', function(err) {
        console.log('timeout posting message ' + JSON.stringify(err))
    })
    botReq.end(JSON.stringify(body))
}

exports.respond = respond
