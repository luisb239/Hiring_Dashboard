'use strict'

module.exports = (service) => {
    return {
        getUserInfo: getUserInfo,
        logout: logout
    }

    async function getUserInfo(req, res) {
        const user = await service.getUserInfo({id: req.user.id, email: req.user.username})
        console.log(user)
    }

    async function logout(req, res) {

    }

}
