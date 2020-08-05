'use strict'

module.exports = () => {
    return {
        getSession
    }

    async function getSession(req, res) {
        console.log(`Session: ${new Date()}`)
        const userId = req.isAuthenticated() ? req.user.id : undefined
        res.send({
            auth: req.isAuthenticated(),
            userId: userId
        })
    }

}
