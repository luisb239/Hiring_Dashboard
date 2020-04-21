'use strict';
// const querystring = require('querystring');

module.exports = (db, domain) => {

    // return {
    //     getRequests : getRequests,
    //     postRequest : postRequest,
    // }

    /*
    function getRequests(query) {
        const queryNames = Object.keys(query)
        if(queryNames.every((name) => domain.isRequestQueryValid(name) !== undefined))
            return db.getRequests(queryToString(query))
        return Promise.reject('Query string not valid.')
    }

    function postRequest(body) {
    }
     */

    function queryToString(queryKeys) {
        function simplify(acc, curr, idx) {
            if (idx === 0)
                return `${curr} = $${idx + 1}`
            else
                return acc + ` AND ${curr} = $${idx + 1}`
        }

        return queryKeys.reduce(simplify)
    }
}