'use strict'

const
    config = require('../common/config/config'),
    errors = require('../common/errors/app-errors'),
    apiUtils = require('../common/util/api-utils'),
    userRoleLayer = require('./user-role-dal'),
    permissionLayer = require('./permission-dal'),
    rolesPermissionLayer = require('./role-permission-dal'),
    rolesLayer = require('./role-dal')

module.exports = {
    /**
     *
     * @param req
     * @param resp
     * @param next
     * @returns {Promise<*>}
     */
    check: async (req, resp, next) => {

        if (config.env === config.test) {
            return next()
        }

        if (!req.isAuthenticated()) {
            return setErrResponse(errors.userNotAuthenticated.message,resp);
        }


        let userRoles = await userRoleLayer.getUserActiveRoles(req.user.id)
        if (!userRoles) {
            return setErrResponse(errors.userRoleNotFound.message,resp);
        }
        userRoles = userRoles.map(role => role.role_id)

        const permission = await permissionLayer.getSpecific(req.method, req.baseUrl)
        if (!permission) {
            return setErrResponse(errors.permissionNotFound.message,resp);
        }

        const permissionRoles = await rolesPermissionLayer.getRolesByPermission(permission.id)

        if (!permissionRoles) {
            return setErrResponse(errors.permissionRolesNotFound.message,resp);
        }
        return searchUserRolesForPermissionRole(permissionRoles.map(permissionRole => permissionRole.role), userRoles, next)
    }
}

/**
 *
 * @param permissionRoles
 * @param userRoles
 * @param next
 * @returns {Promise<*>}
 */
async function searchUserRolesForPermissionRole(permissionRoles, userRoles, next) {
    if (permissionRoles.every(element => element === null)) {
        return null
    }
    return permissionRoles.some(role => userRoles.includes(role)) ? next() : searchUserRolesForPermissionRole(await getParents(permissionRoles));
}

/**
 *
 * @param roles
 * @returns {Promise<[]>}
 */
async function getParents(roles) {
    const parentRoles = []
    await Promise.all(
        roles.map(async (role) => {
            const res = await rolesLayer.getRoleById(role)
            parentRoles.push(res.parent_role)
        }
        )
    )
    return parentRoles
}

/**
 *
 * @param err
 * @param resp
 */
function setErrResponse(err,resp) {
    const error = JSON.parse(err)
    return apiUtils.setResponse(resp, error, error.status)
}
