var MODES = {
    "1": "KC",
    "2": "GAMETYPE",
    "3": "CTF",
    "4": "TDM",
    "5": "Dom",
    "6": "GAMETYPE",
    "7": "HardPoint",
    "8": "HCTDM",
    "9": "GAMETYPE",
    "10": "GAMETYPE"
}

function activityString(winEvent){
    return winEvent ? stringifyEvent(winEvent) : ""
}

function stringifyEvent(event){
    var reply = ""

    reply += ("+" + event.gamertags.length) + " for "
    reply += MODES[event.value] + ":\n"
    reply += "Players: " + event.gamertags.join(", ")

    return reply
}

function filter(events, actor){
    return events
        .map(function(el){ return el[1] }) 
        .filter(function(el){return el.actor === actor}) 
}

module.exports = {
    stringify: activityString,
    filter: filter
}
