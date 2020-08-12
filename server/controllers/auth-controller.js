'use strict'

module.exports = (userService) => {
    return {
        getSession: getSession
    }

    async function getSession(req, res) {
        console.log(`Session: ${new Date()}`)
        const isAuthenticated = req.isAuthenticated()
        const userId = isAuthenticated ? req.user.id : undefined
        const roles = userId ? await userService.getCurrentUserRoles({userId}) : undefined
        res.send({
            auth: isAuthenticated,
            userId: userId,
            userRoles: roles
        })
    }

}
