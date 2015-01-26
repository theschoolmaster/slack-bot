var apiKey, xboxAp, View, Q

apiKey  = process.env.XBOX_API
xboxApi = require('node-xbox')(apiKey)
View    = require('./live-views.js')
Q       = require('q')

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
    var deferred = Q.defer(),
        presence = JSON.parse(presenceJson),
        reply = gamertag + " is " + presence.state + "\n"
    
    if (presence.state === "Offline") {
        reply = View.formatForOffline(reply, presence)
    } else if (presence.state === "Online") {
        reply = View.formatForOnline(reply, presence)
    }

    deferred.resolve(reply)
    return deferred.promise
}

exports.getXuid         = getXuid
exports.getPresence     = getPresence
exports.prepareResponse = prepareResponse
