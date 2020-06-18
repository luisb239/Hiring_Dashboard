'use strict'

const
    users = require('../../resources/dals/users-dal'),
    lists = require('../../resources/dals/lists-dal'),
    userList=require('../../resources/dals/user-list-dal'),
    idps = require('../../resources/dals/idps-dal'),
    userHistories = require('../../resources/dals/users-history-dal'),
    userSession = require('../../resources/dals/user-session-dal'),
    protocol = require('../../resources/dals/protocols-dal'),
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
        return user ? {id: user.id, idp: idp, username: user.username} : null
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

        await idps.create(idpId, idpName, userId.id)

        return {
            id: userId.id,
            idp_id: idpId,
            username: username
        }
    },
    /**
     *
     * @param userId
     * @returns {Promise<boolean>}
     */
    isBlackListed: async (userId)=>{
        let result=await userList.isUserBlackListed(userId)
        result=result.filter(obj=>obj["Lists.list"]==='BLACK')
        return result.length > 0
    },
    /**
     *
     * @param userId
     * @returns {Promise<void>}
     */
    addNotification: async (userId) => {
        await userHistories.create(userId, moment().format("YYYY-MM-DD HH:mm:ss"), "BlackListed User tried to Login")
    },
    createUserSession: async (userId, sessionId) => {
        await userSession.create(userId, sessionId)
    },
    checkProtocol: async (protocolName) => {
        const result = await protocol.get(protocolName)
        return result!=null
    },
    deleteUserSession : async(userId,sessionId)=>{
        await userSession.delete(userId,sessionId)
    }
}
