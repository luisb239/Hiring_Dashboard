'use strict'

module.exports = (userService) => {
    return {
        getSession: getSession
    }

    async function getSession(req, res) {
        console.log(`Session: ${new Date()}`)
        const userId = req.isAuthenticated() ? req.user.id : undefined
        const roles = userId ? await userService.getCurrentUserRoles({userId}) : undefined
        console.log(`userId: ${userId}`)
        console.log('roles', roles);
        console.log(req.isAuthenticated())
        res.send({
            auth: req.isAuthenticated(),
            userId: userId,
            userRoles: roles
        })
    }

}
