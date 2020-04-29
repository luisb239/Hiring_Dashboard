'use strict'

module.exports = (service) => {

    return {getStates, }

    async function getStates(req, res) {
        try {
            const states = await service.getStates()
            res.status(200).send(states)
        }
        catch (e) {
            res.status(500).send({error: 'An unknown error occurred.'})
        }
    }
}
