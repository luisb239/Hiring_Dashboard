'use strict'

const errors = require('./errors/common-errors.js')
const AppError = require('./errors/app-error.js')

module.exports = (userDb, roleDb, authModule) => {

    return {
        getUsers: getUsers,
        getRoleByName: getRoleByName,
        getUserRoles: getUserRoles
    }

    async function getUsers({roleId}) {
        return {
            users: await userDb.getUsers({roleId})
        }
    }

    async function getRoleByName({ role }) {
        const roleInfo = await authModule.role.getByName(role)
        if (!roleInfo) {
            throw new AppError(errors.notFound, "Role not found", `Role with name ${role} not found`)
        }
        return roleInfo
    }

    async function getUserRoles({userId}) {
        return await roleDb.getUserRoles({userId})
    }

}
