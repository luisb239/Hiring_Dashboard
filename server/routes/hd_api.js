'use strict';

module.exports = (service, router) => {

    const request_properties = require('./request_properties_routes.js')(service.request_properties, router)
    const request = require('./request_routes.js')(service.request, router)
    const candidate = require('./candidate_routes.js')(service.candidate, router)

    return router;

}