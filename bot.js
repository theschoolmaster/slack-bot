var HTTPS     = require('https'),
    XBL       = require('./live-api.js'),
    imgSearch = require('./imageSearch.js'),
    slackHook = require('./slackHook.js'),
    urbanDict = require('./urban.js'),
    cwFeed    = require('./bh-clanFeed.js')
    gatekeepr = require('./accessTools.js')


function respond() {
    var request    = this.req.body,
        keyword    = request.trigger_word,
        sourceUser = request.user_name,
        message    = request.text

    console.log(request)

    if (gatekeepr.isRestrictedUser(request.user_id)){
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


    if (keyword === "!img") {
        var query  = message.replace(RegExp(keyword + " "), "")
        var options = {
            "channel": "#" + request.channel_name,
            "username": "imgBot",
            "icon_emoji": ":space_invader:"
        }
        imgSearch(query, options, slackHook, true)
        replyWith.call(this, "")
    }


    if (keyword == "!cwfeed") {

        if (!gatekeepr.isAdmin(request.user_id)){
            replyWith.call(this, "Only a mod can start this tool")
            return
        }

        var command  = message.replace(RegExp(keyword + " "), "")

        var options = {
            "channel": "#" + request.channel_name,
            "username": "cwFeed",
            "icon_emoji": ":space_invader:"
        }


        if (command === "on"){

            if(cwFeed.clanFeedId()){
                replyWith.call(this, "Feed Running in another channel")
                return
            }

            cwFeed.setAndReply(options, slackHook)
            replyWith.call(this, "Clan War Feed Initiated")
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
