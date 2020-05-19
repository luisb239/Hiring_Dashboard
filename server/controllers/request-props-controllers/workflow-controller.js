'use strict'

const handler = require('../handler.js')

module.exports = (service) => {

    return {getWorkflows, getWorkflow}

    async function getWorkflows(req, res) {
        try {
            const workflows = await service.getWorkflows()
            res.status(200).send(workflows)
        } catch (e) {
            handler(e, res, "Unable to retrieve workflows")
        }
    }

    async function getWorkflow(req, res) {
        try {
            const workflows = await service.getWorkflow({
                workflow: req.params.workflow
            })
            res.status(200).send(workflows)
        } catch (e) {
            handler(e, res, "Unable to retrieve workflow")
        }
    }
}
