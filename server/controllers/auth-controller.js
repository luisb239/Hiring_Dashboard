'use strict'

module.exports = (userService) => {
    return {
        getSession: getSession
    }

    async function getSession(req, res) {
        const isAuthenticated = req.isAuthenticated()
        const userId = isAuthenticated ? req.user.id : undefined
        const roles = userId ? await userService.getUserRoles({userId}) : undefined
        res.send({
            auth: isAuthenticated,
            userId: userId,
            userRoles: roles
        })
    }

}
