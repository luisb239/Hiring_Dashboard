'use strict';
// const querystring = require('querystring');

module.exports = (db, domain) => {

    return {
        getRequests : getRequests,
        postRequest : postRequest,
    }


    function getRequests(query) {
        const queryNames = Object.keys(query)
        const queryValues = domain.getQueryValues(query)
        if(queryNames !== [] && queryValues === [])
            return Promise.reject('Query string not valid.')
        return db.getRequests(queryValues)
    }

    function postRequest(body) {
    }

    function queryToString(queryKeys) {

    }
}