var client = require("google-images2")

function retrieveImages(queryString, cb){

    client.search(queryString, function(err, images){
        var imageUrl = images[0].url.replace(/(\.jpeg|\.jpg|\.gif|\.png)(.+)?/, '$1')
        err ? cb.call(this, "error") : cb.call(this, imageUrl)
    }.bind(this))

}

module.exports = retrieveImages
