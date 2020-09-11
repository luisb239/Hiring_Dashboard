'use strict'

const AppError = require('./errors/app-error')
const errors = require('./errors/common-errors.js')

module.exports = (languagesDao, monthsDao, profilesDao, projectsDao,
                  skillsDao, statesDao, statesCslDao, workflowsDao, phasesDao) => {

    return {
        getLanguages: getLanguages,
        getMonths: getMonths,
        getProfiles: getProfiles,
        getProjects: getProjects,
        getSkills: getSkills,
        getStates: getStates,
        getStatesCsl: getStatesCsl,
        getWorkflows: getWorkflows,
        getWorkflow: getWorkflow
    }

    async function getLanguages() {
        return {
            languages: await languagesDao.getLanguages()
        }
    }

    async function getMonths() {
        return {
            months: await monthsDao.getMonths()
        }
    }

    async function getProfiles() {
        return {
            profiles: await profilesDao.getProfiles()
        }
    }

    async function getProjects() {
        return {
            projects: await projectsDao.getProjects()
        }
    }

    async function getSkills() {
        return {
            skills: await skillsDao.getSkills()
        }
    }

    async function getStates() {
        return {
            states: await statesDao.getStates()
        }
    }

    async function getStatesCsl() {
        return {
            statesCsl: await statesCslDao.getStatesCsl()
        }
    }

    async function getWorkflows() {
        return {
            workflows: await workflowsDao.getWorkflows()
        }
    }

    async function getWorkflow({workflow}) {
        const _workflow = await workflowsDao.getWorkflow({workflow})

        if (!_workflow)
            throw new AppError(errors.notFound,
                "Workflow Not Found",
                `Workflow ${workflow} does not exist`)

        const phases = await phasesDao.getPhasesByWorkflow({workflow})

        return {
            workflow: _workflow.workflow,
            phases: phases
        }
    }


}
