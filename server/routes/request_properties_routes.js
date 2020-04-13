'use strict';

const root = 'request_properties';

module.exports = (service, router) => {

    router.get(`/${root}/:property`, getProperties)
    router.post(`/${root}/:property`, postProperty)

    function getProperties(req, res) {
        service.getProperties(req.params.property)
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({error : error}))
    }

    function postProperty(req, res) {
        service.postProperty(req.params.property, req.body.property_to_add)
            .then(result => res.status(201).send(result))
            .catch(error => res.status(400).send({error : error}))

    }
}