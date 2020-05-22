'use strict'

const commonErrors = require('../errors/common-errors.js')
const {validationResult} = require('express-validator');

module.exports = function handle(controller) {
    return (req, res) => {
        try {
            let validation = validationResult(req);
            // Bad Request -> Invalid/Missing Arguments
            if (!validation.isEmpty()) {
                const errors = validation.array()
                res.status(400).send({
                    title: `Invalid arguments at ${errors[0].location} `,
                    detail: `${errors[0].msg} (actual: ${errors[0].value})`
                })
            } else return controller(req, res)
        } catch (error) {
            // Not Found
            if (error.commonError === commonErrors.notFound)
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
