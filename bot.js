var apiKey  = process.env.XBOX_API
var xboxApi = require('node-xbox')(apiKey)
var HTTPS   = require('https')
var Q       = require('q')

function respond() {
    var request       = this.req.body,
    // var request       = JSON.parse(this.req.chunks[0]), //dev
        sourceChannel = request.channel_name,
        keyword       = request.trigger_word,
        sourceUser    = request.user_name,
        message       = request.text
        gamertag      = message.replace(RegExp(keyword + " "), "")
        self          = this

    if (request.text) {
        if (keyword == "!live") {
            getXuid(gamertag)
                .then(function(xuid){
                    return getPresence(xuid)
                })
                .then(function(presenceJson){
                    return prepareResponse(presenceJson)
                })
                .then(function(response){
                    self.res.writeHead(200)
                    postMessage(response, sourceChannel)
                    self.res.end()
                })
        }
    }
}


function getXuid(gamertag){
    var deferred = Q.defer()
    xboxApi.profile.xuid(gamertag, function(err, data){
        err ? deferred.reject(new Error(err)) : deferred.resolve(data)
    })

    return deferred.promise
}

function getPresence(xuid){
    var deferred = Q.defer()
    xboxApi.profile.presence(xuid, function(err, data){
        err ? deferred.reject(new Error(err)) : deferred.resolve(data)
    })
    return deferred.promise
}

function prepareResponse(presenceJson) {
    var deferred = Q.defer()
    var returnedPresence = JSON.parse(presenceJson)
    // var returnedPresence = presenceJson //dev
    var reply = gamertag + " is " + returnedPresence.state + "\n"
    
    if (returnedPresence.state === "Offline") {
        if (returnedPresence.lastSeen) {
            reply += "Last seen: "
            reply += formatDate(new Date(Date.parse(returnedPresence.lastSeen.timestamp))) + "\n"
            reply += "Playing: "
            reply += returnedPresence.lastSeen.titleName
        }
    } else if (returnedPresence.state === "Online") {
        var consoles = returnedPresence.devices,
            game

        consoles.forEach(function(console){
            reply += "Playing: "
            if (console.type === "Xbox360"){
                reply += console.titles[0].name
            } else if (console.type === "XboxOne") {
                currentGame = console.titles.filter(function(app) {
                    return app.placement === "Full"
                })[0]
                reply += currentGame.name
            }
            reply += " on  "
            reply += console.type                        
        })
    }

    deferred.resolve(reply)
    return deferred.promise
}



function postMessage(msg, channel) {
    var botResponse, options, body, botReq

    botResponse = msg

    options = {
        hostname: 'hooks.slack.com',
        path: '/services/T03E23VAN/B03E4RPMW/Ll7ooC6utnGJ7S6flQQ0xOS8',
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

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes
    return strTime + " on " + (date.getMonth() + 1) + "." + date.getDate() + "." + date.getFullYear()
}


exports.respond = respond
