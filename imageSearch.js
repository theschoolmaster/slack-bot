var client = require("google-images2")

function retrieveImages(queryString, channel, cb){

    client.search(queryString, function(err, images){
        images.forEach(function(obj){
            cb(obj.url, channel)
        })
    })

}

module.exports = retrieveImages
