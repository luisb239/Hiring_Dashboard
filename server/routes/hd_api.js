'use strict';

module.exports = (service, router) => {

    function errorRequest(req, res) {
        res.status(404).send({error : "Resource not found!"})
    }

    const request_properties = require('./request_properties_routes.js')(service.request_properties, router)
    const request = require('./request_routes.js')(service.request, router)

    router.use(errorRequest);

    return router;

}