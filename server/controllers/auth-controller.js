'use strict'

module.exports = (userService) => {
    return {
        getSession
    }

    async function getSession(req, res) {
        console.log(`Session: ${new Date()}`)
        const userId = req.isAuthenticated() ? req.user.id : undefined
        const roles = userId ? await userService.getCurrentUserRoles({userId}) : undefined
        res.send({
            auth: req.isAuthenticated(),
            userId: userId,
            userRoles: roles
        })
    }

}
