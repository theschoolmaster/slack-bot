var RESTIRCTED_ROOMS,
    RESTRICTED_USERS = ["U03HTQ2GC"]

var HTTPS     = require('https'),
    XBL       = require('./live-api.js'),
    imgSearch = require('./imageSearch.js'),
    slackHook = require('./slackHook.js'),
    urbanDict = require("./urban.js"),
    cwFeed    = require("./bh-clanFeed.js")



function respond() {
    var request    = this.req.body,
        keyword    = request.trigger_word,
        sourceUser = request.user_name,
        message    = request.text

    console.log(request)

    if (RESTRICTED_USERS.indexOf(request.user_id) !== -1){
        replyWith.call(this, "POOL'S CLOSED")
        return
    }


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


    if (keyword == "!urban") {
        var term  = message.replace(RegExp(keyword + " "), "")
        urbanDict.define.apply(this, [term, replyWith])
    }


    if (keyword == "!ping") {
        replyWith.call(this, "pong!")
    }


    if (keyword == "!kittenbomb") {
        var options = {
            "channel": "#" + request.channel_name,
            "username": "KITTEHS!",
            "icon_emoji": ":cat:"
        }
        imgSearch("cute kittens", options, slackHook)
        replyWith.call(this, "HERE COMES TEH KITTEHZ!!!!")
    }


    if (keyword === "!img") {
        var query  = message.replace(RegExp(keyword + " "), "")
        var options = {
            "channel": "#" + request.channel_name,
            "username": "imgBot",
            "icon_emoji": ":space_invader:"
        }
        imgSearch(query, options, slackHook, true)
    }


    if (keyword == "!cwfeed") {
        var command  = message.replace(RegExp(keyword + " "), "")

        var options = {
            "channel": "#" + request.channel_name,
            "username": "cwFeed",
            "icon_emoji": ":space_invader:"
        }


        if (command === "on"){

            if (!cwFeed.loggedIn()){

                cwFeed.logIn().then(cwFeed.setCookie)
                    .done(function(data){
                        // debugger
                        cwFeed.setAndReply(options, slackHook)
                        replyWith.call(this, "Clan War Feed Initiated")

                    }.bind(this))
            } else {
                cwFeed.update()
                    .done(function(data){
                        cwFeed.setAndReply(options, slackHook)
                        replyWith.call(this, "Clan War Feed Initiated")

                    }.bind(this))
            }
        }


        if (command === "off" ){
            if (cwFeed.clanFeedId()){
                clearInterval( cwFeed.clanFeedId() )
                cwFeed.setClanFeedId(0)
                replyWith.call(this, "Clan War Feed Halted")
            } else {
                replyWith.call(this, "No clan war feed is running")
            }
        }
    }
}

function replyWith(body) {
    console.log("Replying with " + body)
    this.res.writeHead(200, { 'Content-Type': 'application/json' })
    this.res.end('{"text": "' + body + '", "unfurl_links": true}')
}

exports.respond = respond
