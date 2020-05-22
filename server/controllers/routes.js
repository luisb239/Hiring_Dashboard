'use strict'

const validator = require('express-validator')
const handler = require('./express-handler.js')

module.exports = function (global, router, controllers) {

    const users = 'users'
    const roles = 'roles'
    const candidates = 'candidates'
    const requests = 'requests'
    const phases = 'phases'
    const process = 'process'

    // request attributes
    const requestAttributes = 'requests-properties'
    const skills = 'skills'
    const states = 'states'
    const statesCsl = 'states-csl'
    const projects = 'projects'
    const profiles = 'profiles'
    const languages = 'languages'
    const workflows = 'workflows'
    const months = 'months'

    /*
            skill: req.query.skill,
            state: req.query.state,
            stateCsl: req.query.state_csl,
            profile: req.query.profile,
            project: req.query.project,
            workflow: req.query.workflow,
            minQuantity: req.query.minQuantity,
            maxQuantity: req.query.maxQuantity,
            minProgress: req.query.minProgress,
            maxProgress: req.query.maxProgress
     */

    // Get Requests + Query Filter
    router.get(`/${requests}`, handler(controllers.request.getRequests))

    // Get Request By Id
    router.get(`/${requests}/:id`, [
            validator.param('id')
                .isInt({min: 1}).withMessage("Request Id must be of int type and greater than 0")
        ],
        handler(controllers.request.getRequestById))

    // Get Request By User And Role
    router.get(`/${users}/:userId/${roles}/:role/${requests}`, controllers.request.getRequestsByUserAndRole)

    // Get Processes From Request
    router.get(`/${requests}/:id/processes`, controllers.process.getProcessesByRequestId)

    // Get Process Information
    router.get(`/${requests}/:requestId/${candidates}/:candidateId/${process}`, controllers.process.getProcessDetail)

    // Get Workflows...

    // Get Workflow Info
    router.get(`/${workflows}/:workflow`, controllers.workflow.getWorkflow)

    // Get All Phases
    router.get(`/${phases}`, controllers.phase.getPhases)

    // Get Phase Info
    router.get(`/${phases}/:phase`, controllers.phase.getPhase)

    // Create Request
    router.post(`/${requests}`, controllers.request.postRequest)

    // Update Request TODO
    // router.put(`/${requests}/:id`, )

    router.get(`/${requestAttributes}/${skills}`, controllers.skill.getSkills)
    router.get(`/${requestAttributes}/${states}`, controllers.state.getStates)
    router.get(`/${requestAttributes}/${statesCsl}`, controllers.stateCsl.getStatesCsl)
    router.get(`/${requestAttributes}/${projects}`, controllers.project.getProjects)
    router.get(`/${requestAttributes}/${profiles}`, controllers.profile.getProfiles)
    router.get(`/${requestAttributes}/${languages}`, controllers.language.getLanguages)
    router.get(`/${requestAttributes}/${workflows}`, controllers.workflow.getWorkflows)
    router.get(`/${requestAttributes}/${months}`, controllers.months.getMonths)

    // TODO
    // Get Candidates + Available Filter + profiles filter
    router.get(`/${candidates}`, controllers.candidate.getCandidates)

    // Get Candidate by id
    router.get(`/${candidates}/:id`, controllers.candidate.getCandidateById)

    // Update Candidate
    // router.put(`/${candidates}/:id`, controllers.candidate.putCandidate)

    // Create Candidate
    router.post(`/${candidates}`, controllers.candidate.postCandidate)

    return router
}
