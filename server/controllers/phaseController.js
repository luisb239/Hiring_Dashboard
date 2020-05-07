'use strict'

const errors = require('../utils/errors/errors_type.js')

module.exports = (service) => {

    return {
        getPhasesByWorkflow: getPhasesByWorkflow,
    }

    async function getPhasesByWorkflow(req, res) {
        try {
            const phases = await service.getPhasesByWorkflow({
                workflow : req.params.workflow
            })
            res.status(200).send(phases)
        }
        catch (e) {
            // TODO
            res.status(500).send({error: 'Errors not handled yet'})
        }
    }


}
