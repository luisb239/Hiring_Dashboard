'use strict'

const
    users = require('../../functionalities/user-dal'),
    lists = require('../../functionalities/list-dal'),
    idps = require('../../functionalities/idp-dal'),
    userHistories = require('../../functionalities/user-history-dal'),
    BASE_URL = require('../config/config').BASE_URL,
    userSession=require('../../functionalities/user-session-dal'),
    protocol=require('../../functionalities/protocols-dal'),
    moment = require('moment')


module.exports = {

    /**
     * All find user functions should search for a list entry,
     * if it finds one than it should return an error because that user shouldn't login
     * @param userId
     * @returns {Promise<{password: *, id: *, username: *}>}
     */
    findUser: (userId) => users.getById(userId),
    /**
     *
     * @param idp
     * @returns {Promise<*>}
     */
    findUserByIdp: async (idp) => {
        // needs endpoint
        const user = await users.getByIdp(idp)
        return user ? { id: user.id, idp: idp, username: user.username } : null
    },
    /**
     *
     * @param username
     * @returns {Promise<{password: *, id: *, username: *}|null>}
     */
    findCorrespondingUser: async (username) => {
        try {
            return await users.getByUsername(username)
        } catch (error) {
            return null
        }
    },

    /**
     * When Using identity providers you need this method to create an entry on the database for the user using the identity provider
     * If there is an entry for the user who is trying to authenticate we simply search its id on our database and return the specific user
     * @param idpId
     * @param idpName
     * @param username
     * @param password
     * @returns {Promise<{idp_id: *, id: number, username: *}>}
     */
    createUser: async (idpId, idpName, username, password) => {

        const userId = await users.create(username, password)

        await idps.create(idpId, idpName, userId.insertId)

        return {
            id: userId.insertId,
            idp_id: idpId,
            username: username
        }
    },
    /**
     *
     * @param userId
     * @returns {Promise<boolean>}
     */
    isBlackListed: async (userId) => lists.isUserBlackListed(userId).then(result=>result.length>0),
    /**
     *
     * @param userId
     * @returns {Promise<void>}
     */
    addNotification: async (userId) => {
        await userHistories.create(userId, moment().format("YYYY-MM-DD HH:mm:ss"), "BlackListed User tried to Login")
    },
    createUserSession : async(userId,sessionId)=>{
        await userSession.create(userId,sessionId)
    },
    checkProtocol :async(protocolName)=>{
        let result=await protocol.get(protocolName)
        return result.length>0
    }
}
