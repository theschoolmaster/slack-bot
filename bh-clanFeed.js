var request = require("request"),
    when    = require('when'),
    View    = require('./bh-views.js'),
    CLAN_WAR_FEED_ID,
    PREV_FEED = 0
    

function logIn() {
    var deferred = when.defer()
    var codUser  = process.env.COD_USER,
        codPass  = process.env.COD_PASS,

        headers  = {
            'content-type': 'application/json', 
            'bh-lang': 'en', 
            'bh-country-code': 'us',
            'bh-client-os': 'ios',
            'title': 'aw'
        },

        options  = {
            url:'https://prod-api.prod.beachheadstudio.com/aw/si/login/', 
            body: {'email': codUser, 'password': codPass},
            headers: headers,
            json: true
        }

    request.post(options, function(err,res,body){
        err ? deferred.reject(new Error(err)) : deferred.resolve(res.headers['set-cookie'][0].slice(17))
    })
    return deferred.promise
}

function setCookieInEnv(cookie){
    var deferred = when.defer()
    process.env.COD_COOKIE = cookie
    deferred.resolve(cookie)
    return deferred.promise
}

function update() {
    var deferred = when.defer()
    var baseUrl = "https://ec2-api.prod.beachheadstudio.com/aw/clan_wars/waric/1176310/since/"
    var params = "?session_token=" + process.env.COD_COOKIE + "&network=xbl"
    var nowTime = new Date
    var tempTime = new Date(nowTime - 31000) //31 seconds
    var sinceTime = (tempTime.getTime()).toString().slice(0,10)
    var options = {
        // url: baseUrl + 1425064596 + params, // static since time
        url: baseUrl + sinceTime + params, //31 seconds in the past
        headers: {
            "Cookie": "token=" + process.env.COD_COOKIE + ";",
            "User-Agent": "Blacksmith%20Dev/840 CFNetwork/711.1.12 Darwin/14.0.0",
            "bh-app-version": "1.0",
            "bh-client-os": "ios",
            "bh-device-ff": "tablet",
            "bh-device-res": "w768h1024",
            "bh-config-version": "1424397522",
            "X-NewRelic-ID": "XAYOUl9QGwUFUlFXBwQ=",
            "bh-os-version": "7.0",
            "Connection": "keep-alive",
            "bh-device-dpi": "2",
            "bh-title": "ghosts",
            "bh-network": "xbl",
            "bh-lang": "en"
        }
    }
    request.get(options, function(err, res, body){
        err ? deferred.reject(new Error(err)) : deferred.resolve(body)
    })
    return deferred.promise
}

function clanFeedId(){
    return CLAN_WAR_FEED_ID
}

function setClanFeedId(id){
    CLAN_WAR_FEED_ID = id
}

function loggedIn(){
    return !!process.env.COD_COOKIE
}

function codCookie(){
    return process.env.COD_COOKIE
}

function setAndReply(options, respond){
    var processId = setInterval(function(){
        update().done( function(resp){
            var events = JSON.parse(resp).events
            console.log(events)
            if (JSON.stringify(PREV_FEED) !== JSON.stringify(events)){
                PREV_FEED = events
                View.filter(events, 7)
                    .forEach(function(winEvent){
                        respond( View.stringify(winEvent), options ) 
                    })
            } 
        })
    }, 31000)
    setClanFeedId(processId)
}

module.exports = {
    logIn: logIn,
    update: update,
    setCookie: setCookieInEnv,
    clanFeedId: clanFeedId,
    loggedIn: loggedIn,
    setClanFeedId: setClanFeedId,
    setAndReply: setAndReply
}
