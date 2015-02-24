var request = require("request"),
    when    = require('when'),
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
    var sinceTime = new Date(nowTime - 31000) //31 seconds
    var options = {
        // 0 for testing. needs to be epoch time 31 seconds ago
        url: baseUrl + 1422772630 + params, //sinceTime.getTime(),
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

function currentClanFeedRunning(){
    return !!clanFeedId()
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

function activityString(resp) {
    return "Test: +5 to Domination"
}

function setAndReply(options, cb){
    var processId = setInterval(function(){
        update().done( function(resp){
            var events = JSON.parse(resp).events
            debugger
            if (JSON.stringify(PREV_FEED) !== JSON.stringify(events)){
                PREV_FEED = events
                var reply = activityString(events)
                cb(reply, options) 
            } else {
                cb("Test: No new wins", options)
            }
        })
    }, 31000)
    setClanFeedId(processId)
}

// logIn().then(setCookieInEnv).done(update)

module.exports = {
    logIn: logIn,
    update: update,
    setCookie: setCookieInEnv,
    clanFeedId: clanFeedId,
    currentClanFeedRunning: currentClanFeedRunning,
    codCookie: codCookie,
    loggedIn: loggedIn,
    setClanFeedId: setClanFeedId,
    setAndReply: setAndReply
}
