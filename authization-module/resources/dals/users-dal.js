'use strict'


const { UserHistory, User, Idp, Role, List, Session } = require('../sequelize-model'),
    tryCatch = require('../../common/util/functions-utils')

const getById = (id) => tryCatch(async () => {
    const user = await User.findByPk(id)
    delete user.password
    return user
})

module.exports = {
    /**
     *
     * @param idp
     * @returns {Promise<void>}
     */
    getByIdp: (idp) =>
        tryCatch(async () => {
            const result = await Idp.findAll({ where: { idp_id: idp } })
            return result[0] == null ? null : getById(result[0].user_id)
        }),
    /**
     * Requests the database for a user with given id
     * @param id
     * @returns {Promise<*>}
     */
    getById,

    /**
     *
     * @param username
     * @returns {Promise<{password: *, id: *, username: *}>}
     */
    getByUsername: (username) => tryCatch(() => User.findOne({ where: { username: username } })),

    /**
     * Requests the database to return user's that match username and password parameters
     returns the first user found with such parameters
     * @param username
     * @param password
     * @returns {Promise<{password: *, id: *, username: *}>}
     */
    getByUsernameAndPassword: (username, password) => tryCatch(() => User.findOne({
        where: {
            username: username,
            password: password
        }
    })),

    /**
     * Requests the database for all existing users
     * @returns {Promise<*>}
     */
    get: () => tryCatch(async () => {
        const users = await User.findAll({raw: true})
        return users.map(user => {
            delete user.password
            return user
        })
    }),

    /**
     * Requests the database for a new entry in the table users
     Should throw error if there already exists a user with the same parameters
     * @param username
     * @param password
     * @returns {Promise<void>}
     */
    create: async (username, password) => tryCatch(() =>
        User.create({username: username, password: password})),

    /**
     * update specific user's username
     * @param username
     * @param id
     * @returns {Promise<void>}
     */
    updateUsername: async (username, id) => Promise.resolve(
        {
            insertedRows: await tryCatch(() => User.update({username: username}, {where: {id: id}})),
            username
        }),

    /**
     * update specific user's password
     * @param password
     * @param id
     * @returns {Promise<void>}
     */
    updatePassword: (password, id) => tryCatch(() => User.update({password: password}, {where: {id: id}})),

    /**
     *delete user in the database with given id
     * @param userId
     * @returns {Promise<void>}
     */
    delete: (userId) => tryCatch(() => User.destroy({where: {id: userId}})),

    // TODO: this method is a duplicate of the user-roles dal getUserRoles 
    getUserRoles: (userId) => tryCatch(() => User.findAll({where: {id: userId}, include: [Role], raw: true})),

    getUserHistory: (userId) => tryCatch(() => UserHistory.findAll({where: {user_id: userId}}))


}
