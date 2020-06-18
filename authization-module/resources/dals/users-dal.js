'use strict'

const Users = require('../sequelize-model').User,
Idp=require('../sequelize-model').Idp,
    Role= require('../sequelize-model').Role

function getById(id){ return Users.findByPk(id)}
module.exports = {
    /**
     *
     * @param idp
     * @returns {Promise<void>}
     */
    getByIdp: async (idp) => {
        const result=await Idp.findAll({where:{idp_id:idp}})
        return result[0] == null ? null : await getById(result[0].user_id)
    },
    /**
     * Requests the database for a user with given id
     * @param id
     * @returns {Promise<*>}
     */
    getById:getById,

    /**
     *
     * @param username
     * @returns {Promise<{password: *, id: *, username: *}>}
     */
    getByUsername: (username) => Users.findOne({where: {username: username}}),


    /**
     * Requests the database to return user's that match username and password parameters
     returns the first user found with such parameters
     * @param username
     * @param password
     * @returns {Promise<{password: *, id: *, username: *}>}
     */
    get: async (username, password) => Users.findOne({where: {username: username, password: password}}),

    /**
     * Requests the database for all existing users
     * @returns {Promise<*>}
     */
    getAll: async () => Users.findAll({raw: true}),

    /**
     * Requests the database for a new entry in the table users
     Should throw error if there already exists a user with the same parameters
     * @param username
     * @param password
     * @returns {Promise<void>}
     */
    create: (username, password) =>Users.create({username: username,password: password}),


    /**
     * update specific user's username
     * @param username
     * @param id
     * @returns {Promise<void>}
     */
    updateUsername: (username, id) =>Users.update({username: username}, {where: {id: id}}),

    /**
     * update specific user's password
     * @param password
     * @param id
     * @returns {Promise<void>}
     */
    updatePassword: (password, id) =>Users.update({password: password}, {where: {id: id}}),

    /**
     *delete user in the database with given id
     * @param userId
     * @returns {Promise<void>}
     */
    delete:  (userId) =>Users.destroy({where: {id: userId}}),

    getUserRoles: (userId) => Users.findAll({ where: { id:userId}, include: [Role],raw:true})


}
