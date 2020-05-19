'use strict'

const errors = require('../errors/common-errors.js')

module.exports = (error, res, message) => {
    // Bad Request
    if (error.commonError === errors.missingInput || error.commonError === errors.invalidInput)
        res.status(400).send({error: message, title: error.title, detail: error.detail})
    // Not Found
    else if (error.commonError === errors.resourceNotFound)
        res.status(404).send({error: message, title: error.title, detail: error.detail})
    // Conflict
    else if (error.commonError === errors.resourceAlreadyExistent)
        res.status(409).send({error: message, title: error.title, detail: error.detail})
    // Internal Server Error
    else
        res.status(500).send({error: "Internal Server Error", message: "Something unexpected happened!"})
}
