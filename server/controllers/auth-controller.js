'use strict'

module.exports = (service) => {
    return {
        getSession,
        getUserInfo
    }

    async function getSession(req, res) {
        const userId = req.isAuthenticated() ? req.user.id : undefined
        // console.log(req.isAuthenticated());
        res.send({
            auth: req.isAuthenticated(),
            userId: userId
        })
    }

    async function getUserInfo(req, res) {
        const user = await service.createUserIfNotPresent({id: req.user.id, email: req.user.username})
        const roles = await service.getUserRoles({id: req.user.id})
        res.send({
            user: user,
            roles: roles
        })
    }

}
