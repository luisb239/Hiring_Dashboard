'use strict'

const errors = require('./errors.js')

module.exports = (error, res, message) => {
    if (error.type === errors.missingInput || error.type === errors.invalidInput) {
        res.status(400).send({status: 400, error: "Bad Request", message: message, detail: error.message})
    } else if (error.type === errors.resourceNotFound) {
        res.status(404).send({status: 404, error: "Not Found", message: message, detail: error.message})
    } else if (error.type === errors.resourceAlreadyExistent) {
        res.status(409).send({status: 409, error: "Conflict", message: message, detail: error.message})
    } else {
        res.status(500).send({status: 500, error: "Internal Server Error", message: "Something unexpected happened!"})
    }
}
