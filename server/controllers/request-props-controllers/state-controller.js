'use strict'

module.exports = (service) => {

    return {getStates,}

    async function getStates(req, res) {
            const states = await service.getStates()
            res.status(200).send(states)
    }
}
