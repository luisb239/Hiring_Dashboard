'use strict'
module.exports = (service, router, handler) => {
    router.get('/state', getAllStates);
    router.post('/state', postState);

    function getAllStates(req, res) {
        // return handler.request(service.getAllStates(),res,200)
        return service.getAllStates().then(data => handler(res, data))
    }

    function postState(req, res) {
        return service.postState(req.body.name).then(data => handler(res, data))
    }
}