'use strict'
const {List,User,UserList} = require('../sequelize-model')


/**
 *
 * @param userId
 * @returns {Promise<{end_date: *, active, id, list: *, user: *, start_date: *, updater}>}
 */
async function getUsersActive(userId) {
   return await UserList.findAll({
        where: {
            active: 1,
            UserId: userId
        }
    })
}

module.exports = {


    /**
     * Creates a list entry with a user_id associated and a type of list
     * @param userId
     * @param list
     * @param startDate
     * @param endDate
     * @param updater
     * @param active
     * @returns {Promise<CustomError>}
     */
    create: async (list) =>
        List.create({
            list: list
        }),


    /**
     * deactivates active list, it only deactivates because we don't wanna change inactive list's status for history purposes
     * @param listId
     * @returns {*}
     */
    deactivate: async (listId) =>
         List.update({active: 0}, {where: {id: listId}}),

    /**
     * deletes the user association to a list
     * @param listId
     * @returns {*}
     */
    delete: async (listId) =>
         List.destroy({where: {id: listId}}),

    /**
     * asks the database for all list entries
     * @returns {
     * PromiseLike<Uint8Array | BigInt64Array | *[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array
     * | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array> | Promise<Uint8Array | BigInt64Array | *[]
     * | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array>}
     */
    getAll: () => List.findAll({raw: true}),

    get :(id)=>List.findByPk(id),

    /**
     * asks the database for all list entries that are active at the moment
     * @returns {PromiseLike<function(*=): *> | Promise<function(*=): *>}
     */
    getAllActive: () => List.findAll({where: {active: 1}}),

    // asks the database for all list entries that are active and associated with a specific user
    getUsersActive,

    isUserBlackListed: async (userId) =>
        List.findAll({
            where: {
                list: 'BLACK',
                active: 1,
                user_id: userId
            }
        })
}
