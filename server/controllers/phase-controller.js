'use strict'

const handler = require('./handler.js')

module.exports = (service) => {

    return {
        getPhase, getPhases
    }

    async function getPhase(req, res) {
        try {
            const phase = await service.getPhase({
                phase: req.params.phase
            })
            res.status(200).send(phase)
        } catch (e) {
            handler(e, res, "Unable to retrieve phase information")
        }
    }

    async function getPhases(req, res) {
        try {
            const phases = await service.getPhases()
            res.status(200).send(phases)
        } catch (e) {
            handler(e, res, "Unable to retrieve phases")
        }
    }

}
