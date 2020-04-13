'use strict';

module.exports = (db) => {

    const domain = require('../domain/hd_domain.js')();

    return {
        request_properties: require('./request_properties_services.js')(db.request_properties, domain)
    }
}