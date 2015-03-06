var View    = require('./bh-views.js'),
    bhAPI = require('bh-api')(process.env.COD_USER, process.env.COD_PASS),
    CLAN_WAR_FEED_ID,
    PREV_FEED = 0
    

function clanFeedId(){
    return CLAN_WAR_FEED_ID
}

function setClanFeedId(id){
    CLAN_WAR_FEED_ID = id
}

function setAndReply(options, respond){
    var processId = setInterval(function(){

        bhAPI.then(function(client){

            client.events().done(function(events){
                console.log(events)
                if (JSON.stringify(PREV_FEED) !== JSON.stringify(events)){
                    PREV_FEED = events
                    View.filter(events, 7).forEach(function(winEvent){
                        respond( View.stringify(winEvent), options ) 
                    })
                } 
            })

        })

    }, 31000)
    
    setClanFeedId(processId)
}

module.exports = {
    clanFeedId: clanFeedId,
    setClanFeedId: setClanFeedId,
    setAndReply: setAndReply
}
