const
    { RBAC } = require('rbac'),
    config = require('../config/config')

var
    roleDal,
    rolesPermissionsDal,
    permissionsDal,
    rbac


module.exports = async function (jsonObj) {


    if (config.isModuleSetUp) {
        return config.rbac
    }

    rbac = new RBAC()
    config.rbac = rbac
    roleDal = require('../../resources/dals/roles-dal')
    permissionsDal = require('../../resources/dals/permissions-dal')
    rolesPermissionsDal = require('../../resources/dals/roles-permissions-dal')

    await createRoles(jsonObj.roles)
    await createPermissions(jsonObj.permissions)
    await createGrants(jsonObj.grants)
    await rbac.init()

    return rbac
}

function createRoles(roles) {
    return Promise.all(roles.map(async role => {
        roleDal.create(role)
    })
    )
}

function createPermissions(permissions) {
    return Promise.all(permissions.map(async permission => {
        permissionsDal.create(permission.action, permission.resource)
    }))
}

function createGrants(grants) {
    Object.keys(grants).map(async function (key, index) {
        const permissions = grants[key]
        const role = await roleDal.getByName(key)
        permissions.map(async permission => {
            if ("role" in permission) {
                const childRole = await roleDal.getByName(permission.role)
                roleDal.addParentRole(childRole, role)
            } else {
                const p = await permissionsDal.getSpecific(permission.action, permission.resource)
                rolesPermissionsDal.create(role.id, p.id, role.role, p)
            }
        })
    });
}