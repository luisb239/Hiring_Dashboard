'use strict'

const
    moment = require('moment'),
    SELECT_ALL = "SELECT * FROM Users",
    userHistoryDal = require('../functionalities/user-history-dal'),
    dalUtils = require('../common/util/dal-utils'),
    errors = require('../common/errors/app-errors'),
    DATE_FORMAT = "YYYY-MM-DD HH:mm:ss",
    config = require('../common/config/config'),
    parseIfPossible = (data)=> {
        // if there weren't any users found return with an exception
        dalUtils.throwErrorIfNecessary(() => data.length === 0, errors.noUsersFound)
        return {
            id: data[0].id,
            username: data[0].username,
            password: data[0].password,
        };
    },
    /**
     *
     * @param id
     * @returns {Promise<{password: *, id: *, username: *}>}
     */
    getById = async (id) => dalUtils
        .executeQuery(
            {
                statement: `${SELECT_ALL} where id= ?`,
                description: "get user by id",
                params: [id]})
        .then(result=>parseIfPossible(result))

module.exports = {

    /**
     * Requests the database for a user with given id
     */
    getById,
    /**
     *
     * @param idp
     * @returns {Promise<void>}
     */
    getByIdp: async (idp) =>{
        let query={
            statement: `Select * from IDP where idp_id= ?`,
            description: "get user by id",
            params: [idp]
        }
           let result= await dalUtils.executeQuery(query)

        return result[0]==null?null:getById(result[0].user_id)
    },

    /**
     *
     * @param username
     * @returns {Promise<{password: *, id: *, username: *}>}
     */
    getByUsername: async (username) => dalUtils
        .executeQuery(
            {
                statement: `${SELECT_ALL} where username= ?`,
                description: "get user by email",
                params: [username]})
        .then(result=>parseIfPossible(result)),


    /**
     * Requests the database to return user's that match username and password parameters
     returns the first user found with such parameters
     * @param username
     * @param password
     * @returns {Promise<{password: *, id: *, username: *}>}
     */
    get: async (username, password) => dalUtils
        .executeQuery(
            {
                statement: `${SELECT_ALL} WHERE username=? AND password=?`,
                description: "get user matching username and password",
                params: [username, password]})
        .then(result=>parseIfPossible(result)),

    /**
     * Requests the database for all existing users
     * @returns {Promise<*>}
     */
    getAll: async () => dalUtils
        .executeQuery(
            {
                statement: "SELECT * FROM Users",
                description: "get all users on the database",
                params: []})
        .then(result=>{
            // if there weren't any users found return with an exception
            dalUtils.throwErrorIfNecessary(() => result.length < 1, errors.noUsersFound)
            return result.map(user => {
                return {
                    id: user.id,
                    username: user.username,
                    password: user.password,
                }
            })
        }),

    /**
     * Requests the database for a new entry in the table users
     Should throw error if there already exists a user with the same parameters
     * @param username
     * @param password
     * @returns {Promise<void>}
     */
    create: async (username, password) => dalUtils
        .executeQuery(
            {
                statement: config.sgbd === 'mysql' ?
                `INSERT INTO Users(username, password) VALUES (?, ?);` : 'INSERT INTO Users(username, password) VALUES ($1, $2) RETURNING id;',
                description: 'user creation',
                params: [username, password]})
        .then(async (result) => {
            //make sure user creation is registered on the user's history
            await userHistoryDal.create(result.insertId, moment().format(DATE_FORMAT), "User creation")
            return config.sgbd === 'mysql' ? result : { insertId: result[0].id }
        }),


    /**
     * update specific user's username
     * @param username
     * @param id
     * @returns {Promise<void>}
     */
    updateUsername: async (username, id) => dalUtils
        .executeQuery(
            {
                statement: 'UPDATE Users SET username = ? WHERE id = ?',
                description: "user's username update",
                params: [username, id]
            }).then(async result=>{
            //make sure username update is registered on the user's history
            await userHistoryDal.create(id, moment().format(DATE_FORMAT), "Username update")
            return result
        }),

    /**
     * update specific user's password
     * @param password
     * @param id
     * @returns {Promise<void>}
     */
    updatePassword: async (password, id) =>dalUtils
        .executeQuery(
            {
                statement: 'UPDATE Users SET password = ? WHERE id = ?',
                description: "user's password update",
                params: [password, id]})
        .then(async result=>{
            //make sure password update is registered on the user's history
            await userHistoryDal.create(id, moment().format(DATE_FORMAT), "Password update")
            return result
        }),

    /**
     *delete user in the database with given id
     * @param userId
     * @returns {Promise<void>}
     */
    delete: async (userId) => dalUtils.executeQuery(
        {
            statement: 'DELETE FROM Users WHERE id = ?',
            description: "user delete",
            params: [userId]})
        .then(async result=>{
            // if there weren't any users found return with an exception
            dalUtils.throwErrorIfNecessary(() => result.affectedRows === 0, errors.noUsersFound)
            //make sure username update is registered on the user's history
            await userHistoryDal.create(userId, moment().format(DATE_FORMAT), "User deleted")
            return result
        })

}
