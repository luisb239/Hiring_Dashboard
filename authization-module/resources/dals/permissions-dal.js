
const
    tryCatch = require('../../common/util/functions-utils'),
    Permission = require('../sequelize-model').Permission,
    {rbac} = require('../../common/config/config');
/**
 * @module
 */
module.exports = {

    /**
     * Create a new Permission entry if the permission already exists returns the existing permission
     * @returns {Promise<void>}
     * @param {string} action
     * @param {string} resource
     */
    create: (action, resource) => tryCatch(() => rbac.createPermission(action, resource, true)
        .then(() => Permission.findOrCreate({where: {action, resource}}))
        .then(perm => perm[0])),

    //TODO: Needs testing
    createMultiple: permissionsArray => tryCatch(() => rbac.createPermissions(permissionsArray, true).then(() => Permission.bulkCreate(permissionsArray))),

    /**
     * Deletes the Permission through the given id
     * @returns {Promise<void>}
     * @param {int} id
     */
    delete: id =>
        tryCatch(async () => {
            const {action, resource} = await require('./permissions-dal').getSpecificById(id);
            rbac.removeByName(`${action}_${resource}`);
            return Promise.resolve({deletedRows: await Permission.destroy({where: {id}})});
        }),
    /**
     * Returns all existing Permissions
     * @returns {Promise<void>}
     */
    get: () => tryCatch(() => Permission.findAll({raw: true})),
    /**
     *  Returns a Permission by its id
     * @param {int} id
     * @returns {Promise<void>}
     */
    getSpecificById: id => tryCatch(() => Permission.findByPk(id)),
    /**
     * Returns a Permission through the given resource and action.
     * @returns {Promise<*>}
     * @param {string} action
     * @param {string} resource
     */
    getSpecific: (action, resource) => tryCatch(() => Permission.findOne({where: {action, resource}})),

    /**
     * Changes the action and resource of the Permission specified by the id.
     * @param {int} id
     * @param {string} action
     * @param {string} resource
     * @returns {Promise<{resource: *, insertedRows: (Object|Error), action: *, id: *}>}
     */
    update: async (id, action, resource) => Promise.resolve({
        insertedRows: await tryCatch(() => Permission.update({
            action,
            resource
        }, {where: {id}})), action, resource, id
    }),

}
