var http     = require('http'),
    director = require('director'),
    bot      = require('./bot.js'),
    port     = Number(process.env.PORT || 5000)

var router = new director.http.Router({
    '/:keyword': {
        post: bot.respond,
        get: ping
    }
})

var server = http.createServer(function(req, res) {

    router.dispatch(req, res, function(err) {
        res.writeHead(err.status, {
            "Content-Type": "text/plain"
        })
        res.end(err.message)
    })
})

port = Number(process.env.PORT || 5000)
server.listen(port)


function ping() {
    this.res.writeHead(200)
    this.res.end("Hey, I'm Nawbot.")
}
