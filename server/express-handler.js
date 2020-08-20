'use strict'

const commonErrors = require('./services/errors/common-errors.js')

const {validationResult} = require('express-validator');

module.exports = function handle(controllerFunction) {
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
                return await controllerFunction(req, res)
            }
        } catch (error) {
            //handling errors ...
            handleError(res, error)
        }
    }
}

function handleError(res, error) {
    // TODO -> Always log the stack trace -> if there is one
    //  AppError should contain stacktrace
    if (error.commonError === commonErrors.invalidInput || error.commonError === commonErrors.missingInput) {
        // Bad Request
        res.status(400).send(format(error.title, error.detail))
    } else if (error.commonError === commonErrors.notFound) {
        // Not Found
        res.status(404).send(format(error.title, error.detail))
    } else if (error.commonError === commonErrors.conflict) {
        // Conflict
        res.status(409).send(format(error.title, error.detail))
    } else if (error.commonError === commonErrors.gone) {
        // Gone
        res.status(410).send(format(error.title, error.detail))
    } else {
        // Internal Server Error
        console.log(error)
        res.status(500).send(format("Internal Server Error", "Something unexpected happened!"))
    }
}

function format(title, detail) {
    return {
        title: title,
        detail: detail
    }
}


