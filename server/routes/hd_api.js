'use strict';
module.exports = (service, router) => {

    function requestHandler(promise,res,statusCode) {
        promise
            .then(data => handleResponse(null,res,statusCode,data))
            .catch(error => handleResponse(error,res))
    }

    function handleResponse(err, res, successCode, data){
        if(err){
            res.statusCode = err.code;
            return err.message?
                res.end(err.message):res.end()
        }
        res.statusCode = successCode;
        res.end(JSON.stringify(data))
    }

    const handler = {request: requestHandler, response: handleResponse}

    const states = require('./state_routes.js')(service.states, router, handler)
    router.use(errorRequest);

    return router;

    // function getGamesByName(req, res){
    //     const gameName = req.params.gameName;
    //     requestHandler(
    //         service.getGamesByName(gameName),
    //         res,
    //         200
    //     )
    // }
    //
    // function getPopularGames(req, res){
    //     requestHandler(
    //         service.getPopularGames(),
    //         res,
    //         200
    //     )
    // }
    //
    // function createGroup(req, res){
    //     requestHandler(
    //         service.createGroup(req.body),
    //         res,
    //         201
    //     )
    // }
    //
    // function updateGroup(req, res){
    //     const groupID = req.params.groupID;
    //     requestHandler(
    //         service.updateGroup(groupID,req.body),
    //         res,
    //         201
    //     )
    // }
    //
    // function getGroups(req, res){
    //     requestHandler(
    //         service.getGroups(),
    //         res,
    //         200
    //     )
    // }
    //
    // function getGroupDetails(req, res) {
    //     const groupID = req.params.groupID;
    //     requestHandler(
    //         service.getGroupDetails(groupID),
    //         res,
    //         200
    //     )
    // }
    //
    //
    // function addGameToGroup(req, res){
    //     const groupID = req.params.groupID;
    //     const gameID= req.params.gameID;
    //     requestHandler(
    //         service.addGameInGroup(gameID, groupID),
    //         res,
    //         200
    //     )
    // }
    //
    // function removeGameOfGroup(req, res){
    //     const groupID = req.params.groupID;
    //     const gameID = req.params.gameID;
    //     requestHandler(
    //         service.removeGameOfGroup(groupID,gameID),
    //         res,
    //         200
    //     )
    // }
    //
    // function getGamesWithRange(req, res){
    //     const groupID = req.params.groupID;
    //     requestHandler(
    //         service.getGamesWithRange(groupID, Number(req.query.min), Number(req.query.max)),
    //         res,
    //         200
    //     )
    // }
    //
    // function removeGroup(req, res){
    //     const groupID = req.params.groupID;
    //     requestHandler(
    //         service.removeGroup(groupID),
    //         res,
    //         200
    //     )
    // }

    function errorRequest(req, res){
        res.statusCode = 404;
        res.end(JSON.stringify({
            message:"Resource Not Found"
        }))
    }

}