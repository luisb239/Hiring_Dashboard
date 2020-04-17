'use strict';

const entities = require('../domain/hd_entities.js')();

module.exports = () => {

    const {Pool} = require('pg')
    const pool = new Pool()

    function query(text, params) {
        return pool.query(text, params)
    }

    return {
        query: query,
        entities: entities,
        //auth : require('./auth/hd_auth_db.js')(query, entities),
        request_properties: require('./request_properties_db.js')(query),
        request: require('./request_db.js')(query, entities),
        candidate: require('./candidate_db.js')(query, entities)
    }
}