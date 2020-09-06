'use strict'

const
    {List} = require('../sequelize-model'),
    tryCatch = require('../../common/util/functions-utils');

// TODO: should a user be in more than one list?? if not we need to controll that
// JUSTIFICATION: Probably should because being in the greylist and in the redlist even if they block completely different resources is still better than being in the blacklist
// the same with user roles
/**
 * @module
 */
module.exports = {


    /**
     * Creates a list entry with a user_id associated and a type of list
     * @param {string} list
     * @returns {Promise<CustomError>}
     */
    create: list => tryCatch(() => List.create({list})),

    /**
     * Creates multiple list entries, the insertion order respects the order in which the elements are present on the array
     * @param listArray
     * @returns {Promise<Object|Error>}
     */
    createMultiple: listArray => tryCatch(() => List.bulkCreate(listArray)),


    /**
     * Puts the active BIT to 0 of a list with id=listId, deactivates active list, it only deactivates because we don't wanna change inactive list's status for history purposes
     * @param {int} listId
     * @returns {*}
     */
    deactivate: listId => tryCatch(() => List.update({active: false}, {where: {id: listId}})),

    /**
     * Deletes a list by its id
     * @param {int} id
     * @returns {*}
     */
    delete: id => tryCatch(async () => Promise.resolve({deletedRows: await List.destroy({where: {id}})})),

    /**
     * asks the database for all list entries
     * @returns {
     * PromiseLike<Uint8Array | BigInt64Array | *[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array
     * | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array> | Promise<Uint8Array | BigInt64Array | *[]
     * | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array>}
     */
    get: () => tryCatch(() => List.findAll({raw: true})),

    /**
     * Returns the list with the specified id
     * @param {int} id
     * @returns {Promise<Object|Error>}
     */
    getById: id => tryCatch(() => List.findByPk(id)),

    /**
     * Returns all lists with active BIT to 1,
     * asks the database for all list entries that are active at the moment
     * @returns {PromiseLike<function(*=): *> | Promise<function(*=): *>}
     */
    getActive: () => tryCatch(() => List.findAll({where: {active: true}})),

    // update query doesn't return the updated resource for some reason
    /**
     * Changes the list name (field: list) of a list with id=id
     * @param {int} id
     * @param {string} list
     * @returns {Promise<{insertedRows: *, id: *, list: *}>}
     */
    update: async (id, list) => Promise.resolve({
        insertedRows: await tryCatch(() => List.update({list}, {where: {id}})),
        list,
        id
    }),

}
