var http, director, bot, router, server, port

mongoose = require('mongoose')
Player = mongoose.model("Player", {name: String, gamertag: String})
http     = require('http')
director = require('director')
bot      = require('./bot.js')


if(process.env.NODE_ENV === "production") {
    mongoose.connect("mongodb://nawbot:" + process.env.MONGO_PW + "@ds051160.mongolab.com:51160/heroku_app32798926")
} else {
    mongoose.connect('mongodb://localhost/nawbot')
}

Player.find( function(err, all){
    console.log(err ? err : all)
})

router = new director.http.Router({
    '/': {
        post: bot.respond,
        get: ping
    }
})

server = http.createServer(function(req, res) {
    req.chunks = []
    req.on('data', function(chunk) {
        req.chunks.push(chunk.toString())
    })

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
