var urban = require('urban')

function define(input, cb){
    var term = urban(input)

        debugger
    term.first(function(json) {
        if (!json) {
            cb.call(this, "Word not found")
        } else {
            cb.call(this, json.definition)
        }
    }.bind(this))

}

module.exports.define = define
