'use strict'

module.exports = (service) => {

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

    async function getLanguages(req, res) {
        const languages = await service.getLanguages()
        res.status(200).send(languages)
    }

    async function getMonths(req, res) {
        const months = await service.getMonths()
        res.status(200).send(months)
    }

    async function getProfiles(req, res) {
        const profiles = await service.getProfiles()
        res.status(200).send(profiles)
    }

    async function getProjects(req, res) {
        const projects = await service.getProjects()
        res.status(200).send(projects)
    }

    async function getSkills(req, res) {
        const skills = await service.getSkills()
        res.status(200).send(skills)
    }

    async function getStates(req, res) {
        const states = await service.getStates()
        res.status(200).send(states)
    }

    async function getStatesCsl(req, res) {
        const statesCsl = await service.getStatesCsl()
        res.status(200).send(statesCsl)
    }

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
