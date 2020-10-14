const {UserList, List, User} = require('../sequelize-model'),
    tryCatch = require('../../common/util/functions-utils');
/**
 * @module
 */
module.exports = {
    /**
     * Returns the all associations of the user id.
     * @param {int} id
     * @returns {Promise<Object|Error>}
     */
    getByUserId: id => tryCatch(() => UserList.findByPk(id)),

    /**
     * Returns all associations of the user userId. Asks the database for all list entries that are active and associated with a specific user
     * @returns {Promise<{end_date: *, active, id, list: *, user: *, start_date: *, updater}>}
     * @param {int} UserId
     */
    getByUser: UserId => tryCatch(() => UserList.findAll({where: {UserId}, include: [List], raw: true})),


    //TODO: change fields from jointed query
    /**
     * Returns all associations of the list id.
     * @param {int} id
     * @returns {Promise<Object|Error>}
     */
    getByList: id => tryCatch(() => UserList.findAll({where: {ListId: id}, include: [User], raw: true})),

    //TODO: change fields from jointed query
    /**
     * Returns a boolean saying if the user is currently associated with the blacklist.
     * @param {int} UserId
     * @returns {Promise<Object|Error>}
     */
    isUserBlackListed: UserId => tryCatch(() => UserList
        .findAll({where: {UserId}, include: [List], raw: true})
        .then(userLists => userLists.some(userList => userList['List.list'] === 'BLACK' && userList.active == true))),

    /**
     * Associate a user with a list, the parameters userId and listId represent the user id and the list id,
     * the endDate determines when the association between that list and that user will expire and the active bit will turn into 0.
     * @param {int} ListId
     * @param {int} UserId
     * @param {int} updater
     * @param {Date} start_date
     * @param {Date} end_date
     * @param {int} active
     * @returns {Promise<Object|Error>}
     */
    create: (ListId, UserId, updater, start_date, end_date, active) => tryCatch(() => UserList.create({
        ListId,
        UserId,
        start_date,
        end_date,
        active,
        updater
    }, {include: [List]})),


    createMultiple: userListArray => tryCatch(() => UserList.bulkCreate(userListArray, {include: [List]})),
    /**
     * Deletes the association between the specified user and list.
     * @param {int} ListId
     * @param {int} UserId
     * @returns {Promise<{deletedRows: (Object|Error)}>}
     */
    delete: async (ListId, UserId) => Promise.resolve({
        deletedRows: await tryCatch(() => UserList.destroy({
            where: {
                ListId,
                UserId
            }, individualHooks: true
        }))
    }),
    /**
     * Changes the values of start_date, end_date, active and updater of the association between the user with id=user and the list with id=list.
     * @param {int} user
     * @param {int} list
     * @param {Date} start_date
     * @param {Date} end_date
     * @param {int} active
     * @param {int} updater
     * @returns {Promise<{end_date: *, active: *, updatedRows: (Object|Error), updater: *}>}
     */
    update: async (UserId, ListId, start_date, end_date, active, updater) => Promise.resolve({
        updatedRows:
            await tryCatch(() => UserList.update({start_date, end_date, active, updater}, {
                where: {
                    UserId: UserId,
                    ListId: ListId
                }
            })),
        UserId,
        ListId,
        start_date,
        end_date,
        active,
        updater
    }),
    /**
     * Changes the active bit of the association between user UserId and list ListId according to the provided newState.
     * @param {int} UserId
     * @param {int} ListId
     * @param {int} newState
     * @returns {Promise<Object|Error>}
     */
    changeActiveFlag: (UserId, ListId, newState) => tryCatch(() => UserList.update({active: newState}, {
        where: {
            UserId,
            ListId
        }
    })),

}
