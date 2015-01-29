var HTTPS, XBL

HTTPS       = require('https')
XBL         = require('./live-api.js')

function respond() {
    var request    = this.req.body,
        keyword    = request.trigger_word,
        sourceUser = request.user_name,
        message    = request.text

    console.log(request)

    if (keyword == "!live") {
        gamertag = message.replace(RegExp(keyword + " "), "")
        XBL.getXuid(gamertag)
            .then(XBL.getPresence)
            .then(XBL.prepareResponse)
            .done(function(response){
                replyWith.call(this, response)
            }.bind(this),
            function(err){
                console.log(err)
                replyWith.call(this, "An error occured. Check logs for details")
            }.bind(this))
    }

    if (keyword == "!ping") {
        replyWith.call(this, "pong!")
    }
}

function replyWith(body) {
    console.log("Replying with " + body)
    this.res.writeHead(200, { 'Content-Type': 'application/json' })
    this.res.end('{"text": "' + body + '"}')
}

exports.respond = respond
