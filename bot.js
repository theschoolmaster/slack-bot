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
    var request = JSON.parse(this.req.chunks[0])

    if (request.text) {

        // check status of XBoxLive user
        

        if (RegExp("^!live (.+)", 'i').test(request.text)) {
            
            var commands = RegExp("!live (add|remove) (.+)$", 'i').exec(request.text)
            
            if (commands ? (commands[1] === "add" ? true : false) : false) {
                var tag = commands[2]
                addPlayer({gamertag: tag})
                this.res.writeHead(200)
                postMessage("Added gamertag " + tag + " to the roster")
                this.res.end()

            } else {

                var gamertag = RegExp("!live (.+)$", 'i').exec(request.text)[1]
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
                        postMessage(response)
                        that.res.end()
                    })
                })
            }
        }

        // Resonse to "hello nawbot"
        if (RegExp("^hello nawbot$", 'i').test(request.text)) {
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

function postMessage(msg) {
    var botResponse, options, body, botReq

    botResponse = msg

    options = {
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    }

    body = {
        "bot_id": botID,
        "text": botResponse
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

function addToDb(model, object){
    return function(object){
        new model(object).save()
    }
}

var addPlayer = addToDb(Player)

exports.respond = respond
