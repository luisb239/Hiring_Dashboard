'use strict'

const AppError = require('./errors/app-error.js')
const errors = require('./errors/common-errors.js')

module.exports = (userDb, authModule) => {

    return {
        createUserIfNotPresent: createUserIfNotPresent,
        getUserRoles: getUserRoles,
    }

    //TODO -> HOW TO DO THIS? when to create user??
    async function createUserIfNotPresent({id, email}) {
        const userExistsInDb = await userDb.getUserById({userId: id})
        if (!userExistsInDb) {
            await userDb.createUser({userId: id, email, isActive: true})
        }
        return {
            id: id,
            email: email
        }
    }

    async function getUserRoles({id}) {
        const userRoles = await authModule.userRole.getUserActiveRoles(id)
        return await Promise.all(userRoles.map(async (userRoles) => ({
                roleId: userRoles.RoleId,
                role: (await authModule.role.getSpecificById(userRoles.RoleId)).role
            })
        ))

    }

}
