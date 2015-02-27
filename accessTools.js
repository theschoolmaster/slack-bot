var RESTIRCTED_ROOMS,
    RESTRICTED_USERS = [
        { id: 'U03HTQ2GC', name: 'jugularrain-whisky' }
    ],
    ADMINS = [
        { id: 'U03E23VAS', name: 'audibleblink' },
        { id: 'U03E393TU', name: 'lasagnawoof' },
        { id: 'U03E14JAX', name: 'jekku0966' }
    ]

function valuesFor(obj){
    var vals = [];
    for( var key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
            vals.push(obj[key]);
        }
    }
    return vals;
}

function idsArray(group){
    return group.map(function(el){
        return valuesFor(el)[0]
    })
}

function accessGenerator(userId, objArray){
    return function(usrId){
        var ids = idsArray(objArray)
        return ids.indexOf(usrId) === -1 ? false : true
    }
}

module.exports = {
    isAdmin: accessGenerator(null, ADMINS),
    isRestrictedUser: accessGenerator(null, RESTRICTED_USERS)
}
