'use strict'

const AppError = require('./errors/app-error.js')
const errors = require('./errors/common-errors.js')

module.exports = (userDb, authModule) => {

    return {
        getUserInfo: getUserInfo
    }

    /* Podiamos receber informação se é login ou signup..*/
    async function getUserInfo({id, email}) {
        const roles = await authModule.user.getUserRoles(id)

        //

        console.log(roles)
        // This might throw error?
        /*
        const userCreated = await authModule.user.create(username, password)
        await userDb.createUser({id: userCreated.insertId})
        return {
            id: userCreated.insertId
        }

         */
        // Check errors..
    }

}
