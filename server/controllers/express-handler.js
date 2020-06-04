'use strict'

const commonErrors = require('../errors/common-errors.js')
const {validationResult} = require('express-validator');

module.exports = function handle(controller) {
    return async (req, res) => {
        try {
            let validation = validationResult(req);
            if (!validation.isEmpty()) {
                const errors = validation.array()
                res.status(400).send({
                    title: `Invalid arguments at ${errors[0].location}`,
                    detail: `${errors[0].msg} (actual: '${errors[0].value ? errors[0].value : ''}')`
                })
            } else {
                return await controller(req, res)
            }
        } catch (error) {
            // TODO -> IMPROVE
            console.error(error)
            // Bad Request
            if (error.commonError === commonErrors.invalidInput)
                res.status(400).send({title: error.title, detail: error.detail})
            // Not Found
            else if (error.commonError === commonErrors.notFound)
                res.status(404).send({title: error.title, detail: error.detail})
            // Conflict
            else if (error.commonError === commonErrors.alreadyExists)
                res.status(409).send({title: error.title, detail: error.detail})
            // Internal Server Error
            else
                res.status(500).send({error: "Internal Server Error", message: "Something unexpected happened!"})
        }
    }
}
