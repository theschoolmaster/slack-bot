var HTTPS, XBL, slackTeam, slackToken

HTTPS       = require('https')
XBL         = require('./live-api.js')
slackTeam   = process.env.SLACK_TEAM
slackToken  = process.env.SLACK_TOKEN

function respond() {
    var request       = this.req.body,
        sourceChannel = request.channel_name,
        keyword       = request.trigger_word,
        sourceUser    = request.user_name,
        message       = request.text,
        self          = this

    console.log(request)

    if (request.text) {
        if (keyword == "!live") {
            gamertag = message.replace(RegExp(keyword + " "), "")
            XBL.getXuid(gamertag)
                .then(XBL.getPresence)
                .then(XBL.prepareResponse)
                .then(function(response){
                    // console.log(response)
                    replytWith(self, response)
                })
                .catch(function(error) {
                    console.log(error)
                })
        }

        if (keyword == "!ping") {
            replytWith(this, "pong!")
        }
    }
}

function replytWith(context, body) {
    console.log("Replying with " + body)
    context.res.writeHead(200, { 'Content-Type': 'application/json' })
    context.res.end('{"text": "' + body + '"}')
}


exports.respond = respond
