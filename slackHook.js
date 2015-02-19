var slackTeam   = process.env.SLACK_TEAM,
    slackToken  = process.env.SLACK_TOKEN,
    HTTPS       = require('https')


function postMessage(botResponse, body) {
    var options, body, botReq

    options = {
        hostname: 'hooks.slack.com',
        path: '/services/'+ slackTeam +'/B03E4RPMW/' + slackToken,
        method: 'POST'
    }

    body["text"] = botResponse
    body["unfurl_links"] = true

    console.log('sending ' + botResponse + ' to Slack channel: #' + body.channel)

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

module.exports = postMessage
