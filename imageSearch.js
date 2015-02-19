var client = require("google-images2")

function retrieveImages(queryString, options, cb){

    client.search(queryString, function(err, images){
        images.forEach(function(obj){
            cb(obj.url, options)
        })
    })

}

module.exports = retrieveImages
