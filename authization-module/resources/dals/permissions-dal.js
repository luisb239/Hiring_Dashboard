'use strict'

const { Role, RolePermission } = require('../sequelize-model'),
    tryCatch = require('../../common/util/functions-utils'),
    Permission = require('../sequelize-model').Permission,
    config = require('../../common/config/config')

module.exports = {

    /**
     *
     * @param method
     * @param path
     * @param description
     * @returns {Promise<void>}
     */
    create: async (action, resource) => tryCatch(async () => {
        await config.rbac.createPermission(action, resource, true)
        return await (Permission.findOrCreate({
            where: {
                action: action,
                resource: resource
            }
        }))[0]
    }),

    /**
     *
     * @param method
     * @param path
     * @returns {Promise<void>}
     */
    delete: (id) =>
        tryCatch(async () => {
            const permission = await require('./permissions-dal').getSpecificById(id)
            config.rbac.removeByName(permission.action + '_' + permission.resource)
            return Permission.destroy({
                where: {
                    id: id
                }
            })
        }),
    /**
     *
     * @returns {Promise<void>}
     */
    get: () =>
        tryCatch(() => Permission.findAll({raw: true})),
    /**
     *
     * @param id
     * @returns {Promise<void>}
     */
    getSpecificById: (id) => tryCatch(() => Permission.findByPk(id)),
    /**
     *
     * @param method
     * @param path
     * @returns {Promise<*>}
     */
    getSpecific: (action, resource) =>
        tryCatch(() =>
            Permission.findOne({
                where: {
                    action: action,
                    resource: resource
                }
            })),

    update: async (id, action, resource) => Promise.resolve(
        {
            insertedRows: await tryCatch(() => Permission.update({
                action: action,
                resource: resource
            }, {where: {id: id}})),
            action,
            resource
        }),

    //TODO: change fields from jointed query
    getRolesByPermission: (id) => tryCatch(() => RolePermission.findAll({
        where: {PermissionId: id},
        include: [Role],
        raw: true
    }))

}

