const {User, Idp, Role,} = require('../sequelize-model'),
    tryCatch = require('../../common/util/functions-utils');
/**
 * returns a user registered from idp through based on his id
 * @param id
 * @returns {Promise<*|undefined>}
 */
const getById = id => tryCatch(async () => {
    const user = await User.findByPk(id);
    delete user.password;
    delete user.updater;
    return user;
});
/**
 * @module
 */
module.exports = {
    /**
     * Requests the database for a user with given id
     * @param {int} id
     * @returns {Promise<*>}
     */
    getById,
    /**
     * This method internally called on authentication strategies
     * @param {string} idp the id of an IDP
     * @returns {Promise<*|undefined>}
     */
    getByIdp: idp => tryCatch(async () => {
        const [firstIdp] = await Idp.findAll({where: {idp_id: idp}});
        return firstIdp == null ? null : getById(firstIdp.user_id);
    }),

    /**
     * This method gets a specific user information by his username
     * @param {string} username name of the user
     * @returns {Promise<{password: *, id: *, username: *}>}
     */
    getByUsername: username => tryCatch(() => User.findOne({where: {username}})),

    /**
     * Requests the database to return user's that match username and password parameters
     returns the first user found with such parameters
     * @method
     * @param {string} username name of the user
     * @param {string} password
     * @returns {Promise<{password: *, id: *, username: *}>}
     */
    getByUsernameAndPassword: (username, password) => tryCatch(() => User.findOne({where: {username, password}})),

    /**
     * Requests the database for all existing users
     * @returns {Promise<*>}
     */
    get: () => tryCatch(() => User
        .findAll({raw: true})
        .then(users => users.map(user => {
            delete user.password;
            delete user.updater;
            return user;
        }))),

    /**
     * Requests the database for a new entry in the table users.
     Should throw error if there already exists a user with the same parameters
     * @param {string} username name of the user
     * @param {string} password
     * @param {int} updater id of the user who created him
     * @returns {Promise<{password: *, updater: *, username: *}>}
     */
    create: (username, password, updater) => tryCatch(() => User.create({username, password, updater})),

    createMultiple: userArray => tryCatch(() => User.bulkCreate(userArray)),

    /**
     * This method updates the username of a user by its id, the user which is making the update should be sent in the parameter updater
     * @param {string} username
     * @param {int} id
     * @param {int} updater
     * @returns {Promise<void>}
     */
    updateUsername: async (username, id, updater) => Promise.resolve({
        insertedRows: await tryCatch(() => User.update({
            username,
            updater
        }, {where: {id}})), username, id
    }),

    /**
     * This method update the password of a user by its id
     * @param {string} password
     * @param {int} id
     * @returns {Promise<void>}
     */
    updatePassword: (password, id) => tryCatch(() => User.update({password}, {where: {id}})),

    /**
     * This method delete a user by its id, if a user is associated with a role or a list the association will be deleted too
     * @param {int} userId
     * @returns {Promise<void>}
     */
    delete: async (userId) => Promise.resolve({
        deletedRows: await tryCatch(() => User.destroy({
            where: {id: userId},
            individualHooks: true
        }))
    }),

};
