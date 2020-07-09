'use strict'

const commonErrors = require('./services/errors/common-errors.js')

const {validationResult} = require('express-validator');

module.exports = function handle(controller) {
    return async (req, res) => {
        try {
            let validation = validationResult(req);
            if (!validation.isEmpty()) {
                const errors = validation.array()
                res.status(400).send({
                    title: `Invalid arguments at ${errors[0].location}`,
                    detail: `${errors[0].msg}`
                })
            } else {
                // call controller
                return await controller(req, res)
            }
        } catch (error) {
            //handling errors ...
            handleError(res, error)
        }
    }
}


function handleError(res, error) {
    if (error.commonError === commonErrors.invalidInput || error.commonError === commonErrors.missingInput) {
        // Bad Request
        res.status(400).send({title: error.title, detail: error.detail})
    } else if (error.commonError === commonErrors.notFound) {
        // Not Found
        res.status(404).send({title: error.title, detail: error.detail})
    } else if (error.commonError === commonErrors.alreadyExists) {
        // Conflict
        res.status(409).send({title: error.title, detail: error.detail})
    } else {
        // Internal Server Error
        console.log(error)
        res.status(500).send({error: "Internal Server Error", message: "Something unexpected happened!"})
    }
}


