var request = require("request"),
    when    = require('when')

var ENDPOINTS = {
    login: "https://prod-api.prod.beachheadstudio.com/aw/si/login/",
    waric: "https://ec2-api.prod.beachheadstudio.com/aw/clan_wars/waric/1176310/since/"
}

var LOGIN_OPTIONS  = {
    url: ENDPOINTS.login, 
    headers: {
        'content-type': 'application/json', 
        'bh-lang': 'en', 
        'bh-country-code': 'us',
        'bh-client-os': 'ios',
        'title': 'aw'
    },
    json: true
}

function Client(uname, pass) {
    this.uname  = uname
    this.pass   = pass
    this.cookie = null
}

Client.prototype.logIn = function() {
    var deferred = when.defer()
    LOGIN_OPTIONS.body = {'email': this.uname, 'password': this.pass}

    request.post(LOGIN_OPTIONS, function(err,res,body){

        if (err) {
            deferred.reject(new Error(err)) 
        } else { 
            this.cookie = res.headers['set-cookie'][0].slice(17)
            deferred.resolve(res.headers['set-cookie'][0].slice(17))
        }

    }.bind(this))

    return deferred.promise
}

Client.prototype.status = function() {
    var deferred  = when.defer()
    var nowTime   = new Date
    var tempTime  = new Date(nowTime - 31000) //31 seconds
    var sinceTime = (tempTime.getTime()).toString().slice(0,10)
    // var sinceTime = 0 // testing when clan war is over
    var options   = {
        url: ENDPOINTS.waric + sinceTime,
        headers: requestHeaders(this.cookie)
    }

    if (!this.cookie){ 
        this.logIn().done(function(cookie){
            options.headers = requestHeaders(cookie)
            request.get(options, function(err, res, body) {
                err ? deferred.reject(new Error(err)) : deferred.resolve(JSON.parse(body))
            })            
        })  
    } else {

        request.get(options, function(err, res, body) {
            err ? deferred.reject(new Error(err)) : deferred.resolve(JSON.parse(body))
        })
    }
    return deferred.promise
}

Client.prototype.events = function(callback) {
    this.status().done(
        function(clanData){
            callback(clanData.events)
        }, function(err){
            console.log("error: " + err)
        }
    )
}


function requestHeaders(cookie) {
    return {
        "Cookie": "token=" + cookie + ";",
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


module.exports = function(u, p) {
    return new Client(u,p)
}
