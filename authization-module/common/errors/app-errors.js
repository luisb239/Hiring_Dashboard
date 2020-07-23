'use strict'

const CustomError = require('./custom-error')

module.exports = {

    SequelizeValidationError: {
        status: 400
    },

    SequelizeUniqueConstraintError: {
        status: 409
    },

    SequelizeForeignKeyConstraintError: {
        status: 409
    },

    SequelizeConnectionError: {
        status: 400
    },

    Unauthorized: new CustomError({
        title: "Unauthorized",
        detail: `The current user cannot access this resource`,
        status: 401
    })
}
