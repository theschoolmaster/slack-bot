var client = require("google-images2")

function retrieveImages(queryString, cb){

    client.search(queryString, function(err, images){
        err ? cb.call(this, "error") : cb.call(this, images[0].url)
    }.bind(this))

}

module.exports = retrieveImages
