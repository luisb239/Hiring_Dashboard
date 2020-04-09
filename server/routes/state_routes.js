'use strict'
module.exports  = (service, router/*, handler*/) => {
    router.get('/state', getAllStates);
    // router.post('/state', postState);

    function getAllStates(req, res){
        // return handler.request(service.getAllStates(),res,200)
        return service.getAllStates().then(r => res.end(JSON.stringify(r)))
    }

    function postState(req, res){
        return handler.request(service.postState(req.body), res, 201)
    }
}