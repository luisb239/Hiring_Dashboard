'use strict'

const handle = require('./controllers/express-handler.js')

const verifyIfAuthenticated = require('./controllers/middlewares/verify_authenticated')

module.exports = function (router, controllers, authModule, upload, validator) {

    const {body, param, query} = validator

    const candidates = 'candidates'
    const requests = 'requests'
    const phases = 'phases'
    const process = 'process'
    const statistics = 'statistics'

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

    router.get('/auth/session', verifyIfAuthenticated, handle(controllers.auth.getSessionInfo))

    router.get('/auth/azure', authModule.authenticate.usingOffice365)

    router.get('/auth/azure/callback',
        authModule.authenticate.usingOffice365Callback, (req, res) => {
            res.redirect("http://localhost:4200/all-requests")
        })

    // TODO -> TEMPORARY REDIRECT TO CLIENT SIDE
    router.get('/auth/logout', authModule.authenticate.logout, (req, res) => {
        res.redirect("http://localhost:4200/home")
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
        body('dateToSendProfile').optional().isAfter().toDate().withMessage("Date to send profile a date be after today"),
        body('mandatoryLanguages').optional().isArray().withMessage("Mandatory Languages must be an array of languages"),
        body('valuedLanguages').optional().isArray().withMessage("Valued Languages  must be an array of languages"),
    ], handle(controllers.request.postRequest))

    // Update Request
    // router.put(`/${requests}/:id`, )

    /**
     * Get statistics of all requests
     */
    router.get(`/${statistics}`, handle(controllers.statistics.getStatistics))

    /**
     * Save statistics configs
     */
    router.post(`/${statistics}/configs`, handle(controllers))

    /**
     * Get statistics configs
     */
    router.get(`/${statistics}/configs`)

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
    //TODO -> maybe change
    router.put(`/${requests}/:requestId/${candidates}/:candidateId/${process}`, [
        ...processValidators,
        body('infos').optional().isArray()
            .custom(infosArray => infosArray.every(info => info.name && info.value != null))
            .withMessage('Infos must be an array, with each element containing a name and a value property'),
        body('newPhase').optional().isString().withMessage("newPhase must be of string type"),
        body('status').optional().isString().withMessage("status must be of string type"),
        body('unavailableReason').optional().isString().withMessage("unavailableReason must be of string type")
    ], handle(controllers.process.updateProcess))

    /**
     * Update process phase notes
     */
    router.put(`/${requests}/:requestId/${candidates}/:candidateId/${process}/${phases}/:phase`, [
        ...processValidators,
        param('phase').isString().withMessage("phase must be of string type"),
        body('notes').isString().withMessage("Phase notes must be of string type")
    ], handle(controllers.process.updateProcessPhaseNotes))

    /**
     * Get workflow detail
     */
    router.get(`/${workflows}/:workflow`, [
        param('workflow').isString().withMessage("Workflow must be of string type")
    ], handle(controllers.requestProps.getWorkflow))

    /**
     * Get all phases
     */
    router.get(`/${phases}`, handle(controllers.phase.getPhases))

    /**
     * Get phase detail
     */
    router.get(`/${phases}/:phase`, [
        param('phase').isString().withMessage("Phase must be of string type")
    ], handle(controllers.phase.getPhase))


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

    /**
     * Download candidate's CV
     */
    router.get(`/${candidates}/:id/download-cv`, handle(controllers.candidate.downloadCandidateCv))

    /**
     * Update Candidate Info
     */

    //TODO -> MISSING OTHER FIELDS
    router.put(`/${candidates}/:id`, [
        body('available').exists().isBoolean().withMessage("available must be of string type"),
    ], handle(controllers.candidate.updateCandidate))

    /**
     * Create candidate
     */

    /*
    TODO -> Validators missing -> name and cv need to exist
     */
    router.post(`/${candidates}`, upload.single('cv'), handle(controllers.candidate.postCandidate))


    //TODO -> CHANGE ROUTES
    router.get(`/process/reasons`, handle(controllers.process.getUnavailableReasons))

    router.get(`/process/status`, handle(controllers.process.getAllStatus))

    return router
}
