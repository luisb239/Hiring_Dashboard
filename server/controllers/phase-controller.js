'use strict'

module.exports = (service) => {

    return {
        getPhase: getPhase,
        getPhases: getPhases
    }

    async function getPhase(req, res) {
        const phase = await service.getPhase({
            phase: req.params.phase
        })
        res.status(200).send(phase)
    }

    async function getPhases(req, res) {
        const phases = await service.getPhases()
        res.status(200).send(phases)
    }

}
