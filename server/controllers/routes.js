'use strict'

const {body, param, query} = require('express-validator')

const handle = require('./express-handler.js')

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

    // todo -> chamar HANDLE !!

    router.post(`/signup`, [
        body('username').exists().withMessage("Username is required to signup"),
        body('password').exists().withMessage("Password is required to signup")
    ], handle(controllers.authorization.signup))

    router.get(`/teste`, handle(controllers.requestProps.teste))

    // Get Requests + Query Filter
    router.get(`/${requests}`, [
        query('skill').optional(),
        query('state').optional(),
        query('stateCsl').optional(),
        query('profile').optional(),
        query('project').optional(),
        query('workflow').optional(),
        query('minQuantity').optional(),
        query('maxQuantity').optional(),
        query('minProgress').optional(),
        query('maxProgress').optional()
    ], handle(controllers.request.getRequests))

    // Get Request By Id
    router.get(`/${requests}/:id`, [
            param('id').isInt().withMessage("Request Id must be of int type")
        ],
        handle(controllers.request.getRequestById))

    // Get Request By User And Role
    router.get(`/${users}/:userId/${roles}/:role/${requests}`,
        handle(controllers.request.getRequestsByUserAndRole))

    // Create Request
    router.post(`/${requests}`, [
        body('quantity').exists().withMessage("Request must have a quantity"),
        body('description').exists().withMessage("Request must have a description"),
        body('targetDate').exists().withMessage("Request must have a target date"),
        body('skill').exists().withMessage("Request must have a skill"),
        body('project').exists().withMessage("Request must have a project"),
        body('profile').exists().withMessage("Request must have a profile"),
        body('workflow').exists().withMessage("Request must have a workflow"),
        body('dateToSendProfile').optional().toDate(),
        body('mandatoryLanguages').optional().isArray().withMessage("Mandatory Languages must be an array of languages"),
        body('valuedLanguages').optional().isArray().withMessage("Valued Languages  must be an array of languages"),
    ], handle(controllers.request.postRequest))

    // Get Processes From Request
    router.get(`/${requests}/:id/processes`, [
        param('id').isInt().withMessage("Request id must be of int type")
    ], handle(controllers.process.getProcessesByRequestId))

    // Get Process Information
    router.get(`/${requests}/:requestId/${candidates}/:candidateId/${process}`,
        handle(controllers.process.getProcessDetail))

    router.put(`/${requests}/:requestId/${candidates}/:candidateId/${process}`, [
        body('newPhase').exists().withMessage("Body must contain newPhase")
    ], handle(controllers.process.updateProcess))

    // Get Workflow Info
    router.get(`/${workflows}/:workflow`, handle(controllers.requestProps.getWorkflow))

    // Get All Phases
    router.get(`/${phases}`, handle(controllers.phase.getPhases))

    // Get Phase Info
    router.get(`/${phases}/:phase`, handle(controllers.phase.getPhase))

    // Update Request TODO
    // router.put(`/${requests}/:id`, )

    router.get(`/${requestAttributes}/${skills}`,
        handle(controllers.requestProps.getSkills))

    router.get(`/${requestAttributes}/${states}`,
        handle(controllers.requestProps.getStates))

    router.get(`/${requestAttributes}/${statesCsl}`,
        handle(controllers.requestProps.getStatesCsl))

    router.get(`/${requestAttributes}/${projects}`,
        handle(controllers.requestProps.getProjects))

    router.get(`/${requestAttributes}/${profiles}`,
        handle(controllers.requestProps.getProfiles))

    router.get(`/${requestAttributes}/${languages}`,
        handle(controllers.requestProps.getLanguages))

    router.get(`/${requestAttributes}/${workflows}`,
        handle(controllers.requestProps.getWorkflows))

    router.get(`/${requestAttributes}/${months}`,
        handle(controllers.requestProps.getMonths))

    // TODO
    // Get Candidates + Available Filter + profiles filter
    router.get(`/${candidates}`, handle(controllers.candidate.getCandidates))

    // Get Candidate by id
    router.get(`/${candidates}/:id`, handle(controllers.candidate.getCandidateById))

    // Update Candidate
    // router.put(`/${candidates}/:id`, controllers.candidate.putCandidate)

    // Create Candidate
    router.post(`/${candidates}`, handle(controllers.candidate.postCandidate))

    return router
}
