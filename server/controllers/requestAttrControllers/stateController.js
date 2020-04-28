'use strict'

module.exports = (service) => {

    return {getStates, }

    async function getStates(req, res) {
        try {
            const states = service.getStates()
        }
        catch (e) {
            res.status(500).send({error: 'An unknown error occurred.'})
        }
    }
}
