'use strict'

module.exports = (service, router, handler, entity) => {
    router.get(`/${entity}`, getAll);
    router.post(`/${entity}`, post);

    function getAll(req, res) {
        // return handler.request(service.getAllStates(),res,200)
        return service.getAll(entity).then(data => handler(res, data))
    }

    function post(req, res) {
        return service.post(entity, req.body.id).then(data => handler(res, data))
    }
}