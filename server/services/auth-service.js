'use strict'

const AppError = require('../errors/app-error.js')
const errors = require('../errors/common-errors.js')

module.exports = (userDb, authModule) => {

    return {
        createUser: createUser
    }

    async function createUser({username, password}) {
        // This might throw error?
        const userCreated = await authModule.user.create(username, password)
        await userDb.createUser({id: userCreated.insertId})
        return {
            id: userCreated.insertId
        }
        // Check errors..
    }
}
