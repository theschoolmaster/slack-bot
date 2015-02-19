var client = require("google-images2")

function retrieveImages(queryString, options, cb, limit){

    client.search(queryString, function(err, images){
        if (limit){
            cb(images[0].url, options)
        } else {
            images.forEach(function(obj){
                cb(obj.url, options)
            })
        }
    })

}

module.exports = retrieveImages
