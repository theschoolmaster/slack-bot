function formatForOffline(reply, presence) {
    if (presence.lastSeen) {
        reply += "Last seen: "
        reply += formatDate(new Date(Date.parse(presence.lastSeen.timestamp))) + "\\n"
        reply += "Playing: "
        reply += presence.lastSeen.titleName
    }
    return reply
}

function formatForOnline(reply, presence) {
    var consoles = presence.devices
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
        reply += " on "
        reply += console.type                        
    })
    return reply
}

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes
    return strTime + " on " + (date.getMonth() + 1) + "." + date.getDate() + "." + date.getFullYear()
}

exports.formatForOnline  = formatForOnline
exports.formatForOffline = formatForOffline
