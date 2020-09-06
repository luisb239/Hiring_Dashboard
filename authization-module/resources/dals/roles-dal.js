const {Role, Permission, Op} = require('../sequelize-model'),
    {rbac} = require('../../common/config/config'),
    tryCatch = require('../../common/util/functions-utils');

const getSpecificById = roleId => tryCatch(() => Role.findByPk(roleId));

/**
 * @module
 */
module.exports = {

    /**
     * Creates a new role with a possible role Hierarchy, if the role already exists returns the existing one.
     * @param {string} role
     * @returns {Promise<void>}
     */
    create: async (role, parent_role) => tryCatch(async () => {
        await rbac.createRole(role, true);
        if (parent_role) {
            await rbac.grantByName((await getSpecificById(parent_role)).role, role);
        }
        return (await Role.findOrCreate({defaults: {parent_role}, where: {role}}))[0];
    }),

    //TODO:Needs testing
    createMultiple: roleArray => tryCatch(async () => {
        const rolenames = roleArray.map(role => role.role);
        await rbac.createRoles(rolenames, true);
        const rbacRoles = await Promise.all(roleArray.filter(role => role.parent_role !== undefined).map(role => rbac.getRole(role.role)));
        await rbac.grants(rbacRoles);
        return Role.bulkCreate(roleArray);
    }),
    /**
     * Changes the parent role of the Role specified by the id, the parent_role parameter should be an object containing a field label which contains the name of the parent role
     * and field value which contains the id of the parent role. Ex: role.update(3,{label:'admin',value:1});
     * @param {int} id
     * @param {int} parent_role
     * @returns {Promise<{insertedRows: (Object|Error), parent_role: *}>}
     */
    update: async (id, parent_role) => {
        const rbacRole = getSpecificById(id).then(({role}) => rbac.getRole(role));
        rbac.grant(await rbac.getRole(parent_role.label), await rbacRole);
        return Promise.resolve({
            insertedRows: await tryCatch(() => Role.update({parent_role: parent_role.value}, {where: {id}})),
            parent_role
        });
    },


    /**
     * Returns a specific role by its id
     * @param {int} roleId
     * @returns {Promise<*>}
     */
    getSpecificById,

    /**
     * Returns all roles that own a parent_role
     * @returns {Promise<Object|Error>}
     */
    getWithParents: () => tryCatch(() => Role.findAll({where: {parent_role: {[Op.ne]: null}}})),

    /**
     *  Returns a role by its name
     * @param {string} roleName
     * @returns {Promise<Object|Error>}
     */
    getByName: roleName => tryCatch(() => Role.findOne({where: {role: roleName}})),
    /**
     * Delete a specific role by its roleId
     * @param {int} roleId
     * @returns {Promise<void>}
     */
    delete: async roleId =>
        tryCatch(async () => {
            await getSpecificById(roleId).then(({role}) => rbac.removeByName(role));
            return Promise.resolve({deletedRows: await Role.destroy({where: {id: roleId}})});
        }),
    /**
     * Returns all roles
     * @returns {Promise<void>}
     */
    get: () => tryCatch(() => Role.findAll({raw: true})),
    /**
     * Changes the parent role of the given Role, the parentRole parameter should be an object containing a field role which contains the name of the parent role and field id
     * which contains the id of the parent role, the parameter role should be an object containing a field role with the role name and a field id with the role's id.
     * Ex: role.addParentRole({role:'develloper',id:3},{role:'admin',id:1});
     * @param {string} role
     * @param {int} parentRole
     * @returns {Promise<Object|Error>}
     */
    addParentRole: (role, parentRole) => tryCatch(async () => {
        rbac.grant(await rbac.getRole(parentRole.role), await rbac.getRole(role.role));
        return Role.update({parent_role: parentRole.id}, {where: {id: role.id,}});
    }),

};
