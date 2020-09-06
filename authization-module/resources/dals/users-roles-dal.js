const
    {Role, User, UserRoles} = require('../sequelize-model'),
    tryCatch = require('../../common/util/functions-utils');

/**
 * @module
 */
module.exports = {

    /**
     * Associate a user with a role, the parameters user and role represent the user id and the role id, the endDate determines when the association between
     * that role and that user will expire and the active bit will turn into 0.
     * @param {int} user
     * @param {int} role
     * @param {Date} startDate
     * @param {Date} end_date
     * @param {int} updater
     * @param {int} active
     * @returns {Promise<void>}
     */
    create: async (user, role, startDate, end_date, updater, active) => tryCatch(() =>
        UserRoles.create({UserId: user, RoleId: role, start_date: startDate, end_date, updater, active})),

    createMultiple: userRolesArray => tryCatch(() => UserRoles.bulkCreate(userRolesArray)),
    /**
     * Changes the active bit of the association between the user UserId and the role RoleId, according to the provided newState
     * @returns {Promise<void>}
     * @param {int} UserId
     * @param {int} RoleId
     * @param {int} newState
     */
    changeActiveFlag: (UserId, RoleId, newState) => tryCatch(() => UserRoles.update({active: newState}, {
        where: {
            UserId,
            RoleId
        }
    })),
    /**
     * Returns all the associations that have the active bit to 1
     * @returns {Promise<*>}
     */
    getActive: () => tryCatch(UserRoles.findAll({where: {active: true}})),
    /**
     * Returns all the associations that have the active bit to 1 of a specific user
     * @param {int} id
     * @returns {Promise<*>}
     */
    getUserActiveRoles: id => tryCatch(() => UserRoles.findAll({
        where: {UserId: id, active: true},
        include: [Role],
        raw: true
    })),
    /**
     * Return all associations between user and role of the role with the id=roleId.
     * @param {int} RoleId
     * @returns {Promise<Object|Error>}
     */
    getByRole: RoleId => tryCatch(() => UserRoles.findAll({where: {RoleId}, include: [User], raw: true})),

    /**
     * Returns all the associations
     * @returns {Promise<void>}
     */
    get: () => tryCatch(() => UserRoles.findAll({raw: true})),
    /**
     * Return a specific association by its id
     * @param {int} id
     * @returns {Promise<void>}
     */
    getById: id => tryCatch(() => UserRoles.findByPk(id)),
    /**
     * Return all associations between user and role of the user with the id=userId.
     * @param {int} userId
     * @returns {Promise<Object|Error>}
     */
    getByUser: userId => tryCatch(async () => {
        const users = await UserRoles.findAll({where: {UserId: userId}, include: [Role], raw: true});
        return users.map(user => {
            const {'Role.role': role, 'Role.parent_role': parentRole, 'Role.id': unused, ...rest} = user;
            return {role, parentRole, ...rest};
        });
    }),
    /**
     * Deletes the association between the user with UserId and the role with RoleId.
     * @param {int} UserId
     * @param {int} RoleId
     * @returns {Promise<{deletedRows: Promise<Object|Error>}>}
     */
    delete: (UserId, RoleId) => Promise.resolve({
        deletedRows: tryCatch(() => UserRoles.destroy({
            where: {UserId, RoleId},
            individualHooks: true
        }))
    }),
    /**
     * Changes the start_date, endDate, active and updater of the association between the user with id=user and the role with id=role.
     * @param {int} user
     * @param {int} role
     * @param {Date} start_date
     * @param {Date} end_date
     * @param {int} active
     * @param {int} updater
     * @returns {Promise<{end_date: *, active: *, updatedRows: (Object|Error), updater: *}>}
     */
    update: async (UserId, RoleId, start_date, end_date, active, updater) => Promise.resolve({
        updatedRows:
            await tryCatch(() => UserRoles.update({start_date, end_date, active, updater}, {
                where: {
                    UserId: UserId,
                    RoleId: RoleId
                }
            })),
        UserId,
        RoleId,
        start_date,
        end_date,
        active,
        updater
    }),
};
