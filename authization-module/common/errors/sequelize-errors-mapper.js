'use strict'

const errors = require('./app-errors')

module.exports = (sequelizeError) => {
    // we try to find a version of the error with the same name as the actual error, this is made 
    // so that we can return an error containing a status code, which facilitates the api integration
    const ourVersionOfTheError = errors[Object.keys(errors).find(ourErr => ourErr === sequelizeError.name)]

    sequelizeError.status = ourVersionOfTheError ? ourVersionOfTheError.status : 500   

    return sequelizeError
}