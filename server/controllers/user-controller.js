'use strict'

module.exports = (service) => {

    return {
        getUsers: getUsers,
        getRoleByName: getRoleByName
    }

    async function getUsers(req, res) {
        const requests = await service.getUsers({
            roleId: req.query.roleId
        })
        res.status(200).send(requests)
    }

    async function getRoleByName(req, res) {
        const role = await service.getRoleByName({
            role: req.query.role
        })
        res.status(200).send(role)
    }

}
