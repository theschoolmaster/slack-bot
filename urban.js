var urban = require('urban')

function define(input, cb){
    var term = urban(input)

    term.first(function(json) {
        cb.call(this, json.definition)
    }.bind(this))

}

module.exports.define = define
