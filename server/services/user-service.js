'use strict'

const errors = require('./errors/common-errors.js')
const AppError = require('./errors/app-error.js')

module.exports = (userDb) => {

    return {
        getUsers: getUsers
    }

    /**
     * Get users based on filters passed
     * @param roleId : ?number
     */
    async function getUsers({ roleId = null }) {
        return {
            users: await userDb.getUsers({ roleId })
        }
    }

}
