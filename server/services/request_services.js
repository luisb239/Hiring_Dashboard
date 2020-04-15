'use strict';
// const querystring = require('querystring');

module.exports = (db, domain) => {

    return {
        getRequests : getRequests,
        postRequest : postRequest,
    }

    function getRequests(query) {
        const queryNames = Object.keys(query)
        if(queryNames.every((name) => domain.isRequestQueryValid(name) !== undefined))
            return db.getRequests(queryToString(query))
        return Promise.reject('Query string not valid.')
    }

    function postRequest(body) {
        // if (!propertyTable)
        //     return Promise.reject('Parameter not valid.')
        // if (!property_to_add)
        //     return Promise.reject(`Attribute 'property_to_add' in body not found.`)
        //
        // const propertyValid = domain.isPropertyValid(propertyTable);
        //
        // if (!propertyValid)
        //     return Promise.reject(`Property '${propertyTable}' not valid.`);
        //
        // const db_model = propertyValid.redirectTo;
        //
        // return db.findPropertyByKey(db_model.table, property_to_add, db_model.key)
        //     .then(exists => {
        //         if (exists) return Promise.reject(`${property_to_add} of ${propertyTable} type already exists.`)
        //         return db.postProperty(propertyValid.redirectTo.table, property_to_add);
        //     })
    }

    function queryToString(query) {
        const string = JSON.stringify(query)
            .replace('{','')
            .replace('}', '')
            .replace(':', '=')
            .replace(',', ' AND ')
        return string
    }

}