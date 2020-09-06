const {Role, Permission} = require('../sequelize-model');

const RolePermission = require('../sequelize-model').RolePermission,
    rolesDal = require('./roles-dal'),
    config = require('../../common/config/config'),
    rbac = config.rbac,
    tryCatch = require('../../common/util/functions-utils');
/**
 * @module
 */
module.exports = {

    /**
     * Creates an association between a role with RoleId and a permission with id
     * @returns {Promise<void>}
     * @param {int} RoleId
     * @param {int} permissionId
     */
    create: (RoleId, permissionId) =>
        tryCatch(async () => {
            const {action, id, resource} = await require('./permissions-dal').getSpecificById(permissionId);
            rbac.grant(await rbac.getRole((await rolesDal.getSpecificById(RoleId)).role), await rbac.getPermission(action, resource));
            return (await RolePermission.findOrCreate({where: {RoleId, PermissionId: id}}))[0];
        }),

    //TODO
    createMultiple: rolePermissionArray => tryCatch(() => RolePermission.bulkCreate(rolePermissionArray)),
    /**
     * Delete the association between a role and a permission
     * @returns {Promise<void>}
     * @param {int} roleId
     * @param {int} permissionId
     */
    delete: async (roleId, permissionId) => Promise.resolve({
        deletedRows: await tryCatch(async () => {
            const {action, resource} = await require('./permissions-dal').getSpecificById(permissionId);
            const role = await rolesDal.getSpecificById(roleId);
            await rbac.revokeByName(role.role, `${action}_${resource}`);
            return RolePermission.destroy({where: {RoleId: roleId, PermissionId: permissionId}});
        })
    }),
    /**
     * Returns all association between roles and permissions
     * @returns {Promise<Object|Error>}
     */
    get: () =>
        tryCatch(() => RolePermission.findAll({include: [Role, Permission], raw: true})
            .then(rolePermissions =>
                rolePermissions.map(rolePermission => {
                    const {
                        'Permission.action': action, 'Permission.resource': resource, 'Role.role': role, 'Role.parent_role': parentRole,
                        'Permission.id': unused0, 'Role.id': unused1, ...rest
                    } = rolePermission;
                    return {action, resource, role, parentRole, ...rest};
                }))),

    /**
     * Returns all the permissions associated to a specific role
     * @param {int} roleId
     * @returns {Promise<Object|Error>}
     */
    getByRole: roleId => tryCatch(() => RolePermission.findAll({
        where: {RoleId: roleId},
        include: [Permission],
        raw: true
    })),

    //TODO: change fields from jointed query
    /**
     * Returns all the roles associated to a specific permission
     * @param {int} id Id of the permission you want to get
     * @returns {Promise<Object|Error>}
     */
    getByPermission: id => tryCatch(() => RolePermission.findAll({
        where: {PermissionId: id},
        include: [Role],
        raw: true
    })),


}
