'use strict'

const AppError = require('./errors/app-error')
const errors = require('./errors/common-errors.js')

module.exports = (languagesDao, monthsDao, profilesDao, projectsDao,
                  skillsDao, statesDao, statesCslDao, workflowsDao, phasesDao) => {

    return {
        getLanguages, getMonths, getProfiles, getProjects,
        getSkills, getStates, getStatesCsl, getWorkflows, getWorkflow
    }

    async function getLanguages() {
        const languages = await languagesDao.getLanguages()
        return {
            languages: languages
        }
    }

    async function getMonths() {
        const months = await monthsDao.getMonths()
        return {
            months: months
        }
    }

    async function getProfiles() {
        const profiles = await profilesDao.getProfiles()
        return {
            profiles: profiles
        }
    }

    async function getProjects() {
        const projects = await projectsDao.getProjects()
        return {
            projects: projects
        }
    }

    async function getSkills() {
        const skills = await skillsDao.getSkills()
        return {
            skills: skills
        }
    }

    async function getStates() {
        const states = await statesDao.getStates()
        return {
            states: states
        }
    }

    async function getStatesCsl() {
        const statesCsl = await statesCslDao.getStatesCsl()
        return {
            statesCsl: statesCsl
        }
    }

    async function getWorkflows() {
        const workflows = await workflowsDao.getWorkflows()
        return {
            workflows: workflows
        }
    }

    async function getWorkflow({workflow}) {
        const _workflow = await workflowsDao.getWorkflow({workflow})

        if (!_workflow)
            throw new AppError(errors.notFound, "Workflow Not Found", `Workflow ${workflow} does not exist`)

        const phases = await phasesDao.getPhasesByWorkflow({workflow})

        return {
            workflow: _workflow.workflow,
            phases: phases
        }
    }


}
