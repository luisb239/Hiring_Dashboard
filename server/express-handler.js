'use strict'

const commonErrors = require('./services/errors/common-errors.js')
const AppError = require('./services/errors/app-error')
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
    let status = 400, errorDetails
    if (error instanceof AppError) {
        errorDetails = format(error.title, error.detail)
        if (error.commonError === commonErrors.businessLogic) {
            // Bad Request
            status = 400
        } else if (error.commonError === commonErrors.notFound) {
            // Not Found
            status = 404
        } else if (error.commonError === commonErrors.conflict) {
            // Conflict
            status = 409
        } else if (error.commonError === commonErrors.gone) {
            // Gone
            status = 410
        }
    } else {
        // Internal Server Error
        status = 500
        errorDetails = format("Internal Server Error", "Something unexpected happened!")
    }
    // Always log the stacktrace if there is one
    console.log(error.stack || error.detail || error)
    // Send respective error
    res.status(status).send(errorDetails)
}

function format(title, detail) {
    return {
        title: title,
        detail: detail
    }
}


