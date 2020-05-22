'use strict'

module.exports = (service) => {

    return {getWorkflows, getWorkflow}

    async function getWorkflows(req, res) {
            const workflows = await service.getWorkflows()
            res.status(200).send(workflows)
    }

    async function getWorkflow(req, res) {
            const workflows = await service.getWorkflow({
                workflow: req.params.workflow
            })
            res.status(200).send(workflows)
    }
}
