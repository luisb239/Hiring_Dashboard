'use strict'

const {body, param, query, oneOf} = require('express-validator')

const handle = require('./express-handler.js')

module.exports = function (router, controllers, authModule) {

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


    router.get('/auth/azure', authModule.authenticate.usingOffice365)

    router.get('/auth/azure/callback',
        authModule.authenticate.usingOffice365Callback,
        handle(controllers.authorization.getUserInfo));

    router.post('auth/logout',
        authModule.authenticate.logout,
        handle(controllers.authorization.logout))

    // TODO
    //  router.get('/teste', controllers.process.createProcess)

    /**
     * Get all requests + query filter
     */
    router.get(`/${requests}`, [
        query('skill').optional().isString(),
        query('state').optional().isString(),
        query('stateCsl').optional().isString(),
        query('profile').optional().isString(),
        query('project').optional().isString(),
        query('workflow').optional().isString(),
        query('minQuantity').optional().isInt(),
        query('maxQuantity').optional().isInt(),
        query('minProgress').optional().isInt(),
        query('maxProgress').optional().isInt(),
        query('userId').optional().isInt(),
        query('roleId').optional().isInt()
    ], handle(controllers.request.getRequests))

    /**
     * Get request by id
     */
    router.get(`/${requests}/:id`, [
        param('id').isInt().withMessage("Request Id must be of int type")
    ], handle(controllers.request.getRequestById))

    /**
     * Create request
     */
    router.post(`/${requests}`, [
        body('quantity').exists().withMessage("Request must have a quantity"),
        body('description').exists().withMessage("Request must have a description"),
        body('targetDate').exists().withMessage("Request must have a target date"),
        body('skill').exists().withMessage("Request must have a skill"),
        body('project').exists().withMessage("Request must have a project"),
        body('profile').exists().withMessage("Request must have a profile"),
        body('workflow').exists().withMessage("Request must have a workflow"),
        body('dateToSendProfile').optional().isAfter().toDate().withMessage("Date to send profile must be after today"),
        body('mandatoryLanguages').optional().isArray().withMessage("Mandatory Languages must be an array of languages"),
        body('valuedLanguages').optional().isArray().withMessage("Valued Languages  must be an array of languages"),
    ], handle(controllers.request.postRequest))

    /**
     * Get all request processes
     */
    router.get(`/${requests}/:id/processes`, [
        param('id').isInt().withMessage("Request id must be of int type")
    ], handle(controllers.process.getProcessesByRequestId))


    // Get Process Information ->
    // Can change to /process?requestId=1 ; /process?candidateId=1;
    // and even to /process?requestId=1&candidateId=2
    /**
     * Get process detail
     */
    router.get(`/${requests}/:requestId/${candidates}/:candidateId/${process}`, [
        param('requestId').isInt().withMessage("Request Id must be of int type"),
        param('candidateId').isInt().withMessage("Candidate Id must be of int type")
    ], handle(controllers.process.getProcessDetail))

    /**
     * Update process
     */
    router.put(`/${requests}/:requestId/${candidates}/:candidateId/${process}`, [
        param('requestId').isInt().withMessage("Request Id must be of int type"),
        param('candidateId').isInt().withMessage("Candidate Id must be of int type"),
        oneOf([
                body('newPhase').exists().isString().withMessage("NewPhase must be of string type"),
                body('status').exists().isString().withMessage("Status must be of string type"),
                body('unavailableReason').exists().isString().withMessage("Unavailable Reason must be of string type")],
            "Missing Arguments. You must pass, at least, one of the following arguments:" +
            " 'newPhase', 'status' or 'unavailableReason'")
    ], handle(controllers.process.updateProcess))

    /**
     * Get workflow detail
     */
    router.get(`/${workflows}/:workflow`, handle(controllers.requestProps.getWorkflow))

    /**
     * Get all phases
     */
    router.get(`/${phases}`, handle(controllers.phase.getPhases))

    /**
     * Get phase detail
     */
    router.get(`/${phases}/:phase`, handle(controllers.phase.getPhase))

    // Update Request TODO
    // router.put(`/${requests}/:id`, )

    /**
     * Get all skills
     */
    router.get(`/${requestAttributes}/${skills}`,
        handle(controllers.requestProps.getSkills))

    /**
     * Get all states
     */
    router.get(`/${requestAttributes}/${states}`,
        handle(controllers.requestProps.getStates))

    /**
     * Get all states-csl
     */
    router.get(`/${requestAttributes}/${statesCsl}`,
        handle(controllers.requestProps.getStatesCsl))

    /**
     * Get all projects
     */
    router.get(`/${requestAttributes}/${projects}`,
        handle(controllers.requestProps.getProjects))

    /**
     * Get all profiles
     */
    router.get(`/${requestAttributes}/${profiles}`,
        handle(controllers.requestProps.getProfiles))

    /**
     * Get all languages
     */
    router.get(`/${requestAttributes}/${languages}`,
        handle(controllers.requestProps.getLanguages))

    /**
     * Get all workflows
     */
    //TODO -> not consistent -> should be /workflows, instead of /requests-properties/workflows
    router.get(`/${requestAttributes}/${workflows}`,
        handle(controllers.requestProps.getWorkflows))

    /**
     * Get all months
     */
    router.get(`/${requestAttributes}/${months}`,
        handle(controllers.requestProps.getMonths))


    /**
     * Get all candidates + query filter
     */
    // TODO -> FAZER URGENTE
    //profiles=...,..,...,...,
    router.get(`/${candidates}`, [
        query('available').optional().isBoolean().withMessage("Available must be of boolean type"),
        query('profiles').optional().isString().withMessage("Profiles must be of string type")
    ], handle(controllers.candidate.getCandidates))

    /**
     * Get candidate by id
     */
    router.get(`/${candidates}/:id`, handle(controllers.candidate.getCandidateById))

    // Update Candidate
    // router.put(`/${candidates}/:id`, controllers.candidate.putCandidate)

    /**
     * Create candidate
     */
    router.post(`/${candidates}`, handle(controllers.candidate.postCandidate))

    return router
}
