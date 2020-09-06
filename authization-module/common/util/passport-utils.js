const
    users = require('../../resources/dals/users-dal'),
    userList = require('../../resources/dals/user-list-dal'),
    idps = require('../../resources/dals/idps-dal'),
    userHistories = require('../../resources/dals/users-history-dal'),
    userSession = require('../../resources/dals/user-session-dal'),
    authTypes = require('../../resources/dals/authentication-types-dal'),
    moment = require('moment');

module.exports = {

    /**
     * All find user functions should search for a list entry,
     * if it finds one than it should return an error because that user shouldn't login
     * @param userId
     * @returns {Promise<{password: *, id: *, username: *}>}
     */
    findUser: userId => users.getById(userId),

    /**
     *
     * @param idp
     * @returns {Promise<*>}
     */// needs endpoint
    findUserByIdp: idp => users.getByIdp(idp).then(user => user ? {idp, id: user.id, username: user.username} : null),
    /**
     *
     * @param username
     * @returns {Promise<{password: *, id: *, username: *}|null>}
     */
    findCorrespondingUser: async username => {
        try {
            return await users.getByUsername(username);
        } catch (error) {
            return null;
        }
    },
    findUserByIdpOrCreate: async (idpId, idpName, username, password) => {
        const userWithIdp = await users.getByIdp(idpId);
        if (userWithIdp) {
            return {
                id: userWithIdp.id, idp: idpId, username: userWithIdp.username
            }
        }
        const user = await users.getByUsername(username)
        if (user) {
            await idps.create(idpId, idpName, user.id)
            return {
                id: user.id, idp_id: idpId, username
            }
        }
        users.create(username, password)
            .then(userId => idps.create(idpId, idpName, userId.id)
                .then(() => ({id: userId.id, idp_id: idpId, username})));
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

        const {id} = await users.create(username, password);
        await idps.create(idpId, idpName, id);
        return {id, username, idp_id: idpId};
    },

    /**
     *
     * @param userId
     * @returns {Promise<boolean>}
     */
    isBlackListed: userId => userList.isUserBlackListed(userId),

    /**
     *
     * @param userId
     * @returns {Promise<void>}
     */
    addNotification: userId => userHistories.create(new Date(), userId, 'BlackListed User tried to Login', userId),

    checkProtocol: (protocol, idp) => authTypes.getByName(protocol, idp),
};
