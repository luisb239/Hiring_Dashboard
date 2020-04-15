'use strict';

const root = 'requests';

module.exports = (service, router) => {

    router.get(`/${root}`, getRequests)
    router.post(`/${root}`, postRequest)

    function getRequests(req, res) {
        service.getRequests(req.query)
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({error : error}))
    }

    function postRequest(req, res) {
        service.postProperty(req.body)
            .then(result => res.status(201).send(result))
            .catch(error => res.status(400).send({error : error}))

    }
}