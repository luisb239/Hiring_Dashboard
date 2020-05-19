'use strict'


const errors = require('./../../errors/common-errors')
const AppError = require('./../../errors/app-error.js')

module.exports = (workflowDb, phasesDb) => {

    return {getWorkflows, getWorkflow}

    async function getWorkflows() {
        const workflows = await workflowDb.getWorkflows()
        return {workflows: workflows}
    }

    async function getWorkflow({workflow}) {
        const _workflow = await workflowDb.getWorkflow({workflow})

        if (!_workflow)
            throw new AppError(errors.resourceNotFound, "Workflow Not Found", `Workflow ${workflow} does not exist`)

        const phases = await phasesDb.getPhasesByWorkflow({workflow})
        return {
            workflow: _workflow.workflow,
            phases: phases
        }
    }
}
