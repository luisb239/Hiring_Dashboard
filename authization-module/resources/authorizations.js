'use strict'

const usersDal = require('./dals/users-dal')

const userRoleDal = require('../resources/dals/users-roles-dal'),
    config = require('../common/config/config'),
    errors = require('../common/errors/app-errors')
const rbac = require('../common/rbac')

module.exports = {
    /**
     *
     * @param req
     * @param resp
     * @param next
     * @returns {Promise<*>}
     */
    check: async (req, resp, next) => {
        const resource = req.path.split("/")[2]
        const action = req.method

        const user = req.user
        var roles = []

        if (user) {
            roles = await usersDal.getUserRoles(user.id)
            roles = roles.map(role => role["Roles.role"])
            if (roles.includes('admin')) {
                return next()
            }
        }

        roles.push("guest")

        for (let i = 0; i < roles.length; i++) {
            if (await config.rbac.can(roles[i], action, resource)) {
                return next()
            }
        }
        return next(errors.Unauthorized)
    },

    getUserPermissions: async (req, resp, next) => {
        const user = req.user
        let permissions = []
        var roles = []

        if (user) {
            roles = await usersDal.getUserRoles(user.id)
            roles = roles.map(role => role["Roles.role"])
        }

        roles.push("guest")

        await Promise.all(roles.map(async role => permissions.push(await config.rbac.getScope(role))))
        permissions = permissions.flat()
        return permissions
    },

    authorizationInfo: async (req) => {
        const roles = userRoleDal.getUserActiveRoles(req.user.id)

        roles.push("guest")
        
        return req.body.permissions
            .map(permission =>
                JSON.parse(`${permission.resource}/${permission.action}: ${roles
                    .some(role => rbac.can(role.role, permission.action, permission.resource))}`))
    }

}
