'use strict'

module.exports = (service) => {

    return {getStatesCsl, }

    async function getStatesCsl(req, res) {
        try {
            const statesCsl = await service.getStatesCsl()
            res.status(200).send(statesCsl)
        }
        catch (e) {
            res.status(500).send({error: 'An unknown error occurred.'})
        }
    }
}
