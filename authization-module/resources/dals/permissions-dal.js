'use strict'


const Permission = require('../sequelize-model').Permission,
    config = require('../../common/config/config')


module.exports = {


    /**
     *
     * @param method
     * @param path
     * @param description
     * @returns {Promise<void>}
     */
    create: async (action, resource) => {
        config.rbac.createPermission(action, resource, true)
        Permission.findOrCreate({
            where:{
            action: action,
            resource: resource
            }
        })
    },

    /**
     *
     * @param method
     * @param path
     * @returns {Promise<void>}
     */
    delete: async (id) =>
        Permission.destroy({
            where: {
                id: id
            }
        }),
    /**
     *
     * @returns {Promise<void>}
     */
    getAll: async () =>
        Permission.findAll({ raw: true }),
    /**
     *
     * @param id
     * @returns {Promise<void>}
     */
    getSpecificById: async (id) =>
        Permission.findByPk(id),
    /**
     *
     * @param method
     * @param path
     * @returns {Promise<*>}
     */
    getSpecific: async (action, resource) =>
        Permission.findOne({
            where: {
                action: action,
                resource: resource
            }
        }),

}

