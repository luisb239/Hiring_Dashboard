'use strict';
module.exports = (service, router) => {

    // function requestHandler(promise,res,statusCode) {
    //     promise
    //         .then(data => handleResponse(null,res,statusCode,data))
    //         .catch(error => handleResponse(error,res))
    // }
    //
    // function handleResponse(err, res, successCode, data){
    //     if(err){
    //         res.statusCode = err.code;
    //         return err.message?
    //             res.end(err.message):res.end()
    //     }
    //     res.statusCode = successCode;
    //     res.end(JSON.stringify(data))
    // }

    // const handler = {request: requestHandler, response: handleResponse}

    function responseHandler(res, body) {
        res.setHeader('Content-type', 'application/json');
        res.statusCode = body.status_code;
        res.end(JSON.stringify({message: body.message, result: body.result}))
    }

    const states = require('./state_routes.js')(service.states, router, responseHandler/*, handler*/)
    const generic = require('./generic_routes')(service.generic, router, responseHandler, 'project_profile')
    router.use(errorRequest);

    return router;

    function errorRequest(req, res) {
        res.statusCode = 404;
        res.end(JSON.stringify({
            message: "Resource Not Found"
        }))
    }

}