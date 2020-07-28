'use strict'

const errors = require('./errors/common-errors.js')
const AppError = require('./errors/app-error.js')

module.exports = (userDb, authModule) => {

    return {
        getUsers: getUsers,
        getRoleByName: getRoleByName
    }

    /**
     * Get users based on filters passed
     * @param roleId : ?number
     */
    async function getUsers({roleId = null}) {
        return {
            users: await userDb.getUsers({roleId})
        }
    }

    async function getRoleByName({role}) {
        const roleInfo = await authModule.role.getByName(role)
        if (!roleInfo) {
            throw new AppError(errors.notFound, "Role not found", `Role with name ${role} not found`)
        }
        return roleInfo
    }

}
