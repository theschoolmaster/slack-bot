var apiKey  = process.env.XBOX_API
var xboxApi = require('node-xbox')(apiKey)
var HTTPS   = require('https')

function respond() {
    var request       = this.req.body,
        sourceChannel = request.channel_name,
        keyword       = request.trigger_word,
        sourceUser    = request.user_name,
        message       = request.text

    console.log(request)

    if (request.text) {
        if (keyword == "!live") {
            var gamertag = message.replace(RegExp(keyword + " "), "")
            console.log(gamertag)
            var that = this
            xboxApi.profile.xuid(gamertag, function(err, returnedXuid) {
                xboxApi.profile.presence(returnedXuid, function(err, returnedPresence) {
                    var returnedPresence = JSON.parse(returnedPresence)
                    var response = gamertag + " is " + returnedPresence.state + "\n"

                    if (returnedPresence.state === "Offline") {
                        response += "Last seen: "
                        response += formatDate(new Date(Date.parse(returnedPresence.lastSeen.timestamp))) + "\n"
                        response += "Playing: "
                        response += returnedPresence.lastSeen.titleName
                    } else if (returnedPresence.state === "Online") {
                        console.log(returnedPresence)
                        response += "Playing: "
                        response += returnedPresence.devices[0].titles[1].name
                    }

                    that.res.writeHead(200)
                    postMessage(response, sourceChannel)
                    that.res.end()
                })
            })
        } else {
            console.log("don't care")
            this.res.writeHead(200)
            this.res.end()
        }
    }
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
        if (res.statusCode == 202) {
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
