'use strict'

const {body, param, query, check} = require('express-validator')

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
        authModule.authenticate.usingOffice365Callback, (req, res) => {
            // TODO -> shouldn´t do this
            res.redirect("http://localhost:4200/all-requests")
        })

    router.post('auth/logout', authModule.authenticate.logout, (req, res) => {
        // TODO -> shouldn´t do this
        res.redirect("http://localhost:4200")
    })

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


    // Get Process Information ->
    // Can change to /process?requestId=1 ; /process?candidateId=1;
    // and even to /process?requestId=1&candidateId=2
    /**
     * Process endpoints common validators
     */
    const processValidators = [
        param('requestId').isInt().withMessage("Request Id must be of int type"),
        param('candidateId').isInt().withMessage("Candidate Id must be of int type")
    ]

    /**
     * Get all request processes
     */
    router.get(`/${requests}/:id/processes`, [
        param('id').isInt().withMessage("Request id must be of int type")
    ], handle(controllers.process.getProcessesByRequestId))


    /**
     * Get process detail
     */
    router.get(`/${requests}/:requestId/${candidates}/:candidateId/${process}`,
        processValidators,
        handle(controllers.process.getProcessDetail))

    /**
     * Create process
     */
    //TODO -> should be -> /process
    router.post(`/${requests}/:requestId/${candidates}/:candidateId/${process}`,
        processValidators,
        handle(controllers.process.createProcess))

    /**
     * Update process
     */
    router.put(`/${requests}/:requestId/${candidates}/:candidateId/${process}`, [
        ...processValidators,
        body('infos').optional().isArray()
            .custom(infosArray => infosArray.every(info => info.name && info.value))
            .withMessage('Infos must be an array, with each element containing a name and a value property'),
        body('newPhase').optional().isString().withMessage("newPhase must be of string type"),
        body('status').optional().isString().withMessage("status must be of string type"),
        body('unavailableReason').optional().isString().withMessage("unavailableReason must be of string type"),
        check().exists().custom((_, {req}) => {
            return (req.body.infos || req.body.newPhase || req.body.status || req.body.unavailableReason)
        })
            .withMessage("You must pass, at least, one of the following arguments:" +
                " 'newPhase', 'status', 'unavailableReason' or 'infos'")
    ], handle(controllers.process.updateProcess))

    /**
     * Update phase information of process
     */
    /*
    router.put(`/${requests}/:requestId/${candidates}/:candidateId/${process}/`, [
        ...processValidators,
    ], handle())


     */

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
     * Get all candidates
     */
    router.get(`/${candidates}`, [
        query('available').optional().isBoolean().withMessage("Available must be of boolean type"),
        query('profiles').optional().isString().withMessage("Profiles must be of string type separated by ','")
    ], handle(controllers.candidate.getCandidates))

    /**
     * Get candidate by id
     */
    router.get(`/${candidates}/:id`, handle(controllers.candidate.getCandidateById))

    // Update Candidate
    //  router.put(`/${candidates}/:id`, controllers.candidate.updateCandidate)

    /**
     * Create candidate
     */
    router.post(`/${candidates}`, handle(controllers.candidate.postCandidate))

    //TODO -> CHANGE ROUTES

    router.get(`/process/reasons`, handle(controllers.process.getUnavailableReasons))

    router.get(`/process/status`, handle(controllers.process.getAllStatus))

    return router
}
