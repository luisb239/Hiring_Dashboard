'use strict'

module.exports = (service) => {
    return {
        getSessionInfo,
        logout
    }

    async function getSessionInfo(req, res) {
        const user = await service.createUserIfNotPresent({id: req.user.id, email: req.user.username})
        const roles = await service.getUserRoles({id: req.user.id})
        res.send({
            user: user,
            roles: roles
        })
    }

    async function logout(req, res) {
    }

}
