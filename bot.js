var botID   = process.env.BOT_ID
var apiKey  = process.env.XBOX_API
var xboxApi = require('node-xbox')(apiKey)
var HTTPS   = require('https')

var texts   = [
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


function respond() {
    var request = JSON.parse(this.req.body)
    var sourceChannel = request.channel_name
    var keyword = request.trigger_word
    var sourceUser = request.user_name
    var message = request.text

    if (request.text) {
        console.log(sourceUser + " " + sourceChannel + " " + keyword + " " + message)
        if (keyword == "!live") {
            var gamertag = message.replace(RegExp(keyword + " ", ""))

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
                        response += "Playing: "
                        response += returnedPresence.devices[0].titles[1].name
                    }

                    that.res.writeHead(200)
                    postMessage(response, sourceChannel)
                    that.res.end()
                })
            })

        }

        // Resonse to "hello nawbot"
        if (RegExp("^hey $", 'i').test(request.text)) {
            this.res.writeHead(200)
            postMessage("Very nice of you to think of me.  I was starting to feel neglected")
            this.res.end()
        }

        // Logan's drunk texts
        if (RegExp("^text logan$", 'i').test(request.text)) {
            rand = Math.floor(Math.random() * texts.length)
            this.res.writeHead(200)
            postMessage(texts[rand])
            this.res.end()
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
        "username": "webhookbot",
        "text": botResponse,
        "icon_emoji": ":ghost:"
    }

    console.log('sending ' + botResponse + ' to ' + botID)

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
