'use strict'

module.exports = (service) => {

    return {
        getUsers: getUsers
    }

    async function getUsers(req, res) {
        const requests = await service.getUsers({
            roleId: req.query.roleId
        })
        res.status(200).send(requests)
    }

}
