'use strict'

module.exports = (service) => {
    return {
        signup: signup
    }

    async function signup(req, res) {
        // TODO -> RETURN ID for response
        await service.createUser({
            username: req.body.username,
            password: req.body.password
        })
        //TODO -> SIGN UP SUCCESSFUL
        res.status(201)
    }
}
