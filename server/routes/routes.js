'use strict'

const handle = require('../express-handler.js')

const verifyIfAuthenticated = require('../controllers/middlewares/verify_authenticated')

module.exports = function (router, controllers, authModule, upload, validator) {

    const {body, param, query, checkSchema, header} = validator

    const users = 'users'
    const roles = 'roles'
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

    // All endpoints should need the user to be authenticated?

    router.get('/auth/session', handle(controllers.auth.getSession))

    router.get('/auth/azure', authModule.authenticate.usingOffice365)

    router.get('/auth/azure/callback', authModule.authenticate.usingOffice365Callback, (req, res) => {
        // TODO -> Before redirect take into account req.referer ??
        res.redirect("http://localhost:4200/")
    })

    router.post('/auth/logout', authModule.authenticate.logout, handle(controllers.auth.getSession))

    router.get('/count', [
        verifyIfAuthenticated,
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
        query('targetDate').optional().isString(),
        query('currentUser').optional().isBoolean(),
    ], handle(controllers.request.countRequests))

    /**
     * Get all requests + query filter
     */
    router.get(`/${requests}`, [
        verifyIfAuthenticated,
        query('pageNumber').optional().isInt(),
        query('pageSize').optional().isInt(),
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
        query('targetDate').optional().isString(),
        query('currentUser').optional().isBoolean(),
    ], handle(controllers.request.getRequests))

    /**
     * Get request by id
     */
    router.get(`/${requests}/:id`, [
        //verifyIfAuthenticated,
        param('id').isInt().withMessage("Request Id must be of int type")
    ], handle(controllers.request.getRequestById))

    /**
     * Create request
     */
    router.post(`/${requests}`, [
        verifyIfAuthenticated,
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


    // TODO - NEEDS TIMESTAMP
    /**
     * Update Request
     */
    router.patch(`/${requests}/:id`, [
        body('quantity').exists().withMessage("Request must have a quantity"),
        body('targetDate').exists().withMessage("Request must have a target date"),
        body('skill').exists().withMessage("Request must have a skill"),
        body('project').exists().withMessage("Request must have a project"),
        body('profile').exists().withMessage("Request must have a profile"),
        body('dateToSendProfile').optional().isAfter().toDate().withMessage("Date to send profile a date be after today"),
        body('mandatoryLanguages').optional().isArray().withMessage("Mandatory Languages must be an array of languages"),
        body('valuedLanguages').optional().isArray().withMessage("Valued Languages must be an array of languages"),
    ], handle(controllers.request.patchRequest))

    /**
     * Remove Language From Request
     */
    router.delete(`/${requests}/:id/languages`, [
        query('language').exists().isString().withMessage("Language must exist and be a string"),
        query('isMandatory').exists().isBoolean().withMessage("Language Mandatory must exist and be a boolean")
    ], handle(controllers.request.deleteLanguage))

    /**
     * Get statistics of all requests
     */
    router.get(`/${statistics}`, verifyIfAuthenticated, handle(controllers.statistics.getStatistics))

    /**
     * Get user's statistics configs
     */
    router.get(`/${statistics}/configs`, verifyIfAuthenticated, handle(controllers.statistics.getUserStatisticsConfigs))

    /**
     * Save user's statistics configs
     */
    router.post(`/${statistics}/configs`, verifyIfAuthenticated, handle(controllers.statistics.saveUserStatisticsConfigs))

    /**
     * Get user's statistics configs details
     */
    router.get(`${statistics}/configs/:name`, [
        verifyIfAuthenticated,
        param('name').isString().withMessage("Profile name must be of string type")
    ], handle(controllers.statistics.getUserStatisticsConfigsDetails))

    // TODO -> DELETE USER STATISTICS CONFIGS PROFILE MISSING!!

    /**
     * Get all users + query filter
     */
    router.get(`/${users}`, [
        query('roleId').optional().isInt(),
    ], handle(controllers.user.getUsers))

    /**
     * Get role by name
     */
    // TODO -> maybe find a better route..
    router.get(`/${roles}`, [
        query('role').isString().withMessage("Role Name must be a string")
    ], handle(controllers.user.getRoleByName))

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
        verifyIfAuthenticated,
        param('id').isInt().withMessage("Request id must be of int type")
    ], handle(controllers.process.getProcessesByRequestId))


    /**
     * Get process detail
     */
    router.get(`/${requests}/:requestId/${candidates}/:candidateId/${process}`, [
            verifyIfAuthenticated,
            ...processValidators
        ],
        handle(controllers.process.getProcessDetail))

    // TODO - NEEDS TIMESTAMP
    /**
     * Create process
     */
    //TODO -> should be -> /process
    router.post(`/${requests}/:requestId/${candidates}/:candidateId/${process}`, [
        verifyIfAuthenticated,
        ...processValidators
    ], handle(controllers.process.createProcess))


    // TODO - NEEDS TIMESTAMP
    /**
     * Update process
     */
    //TODO -> maybe change
    router.put(`/${requests}/:requestId/${candidates}/:candidateId/${process}`, [
        verifyIfAuthenticated,
        ...processValidators,
        body('infos').optional().isArray()
            .custom(infosArray => infosArray.every(info => info.name && info.value != null))
            .withMessage('Infos must be an array, with each element containing a name and a value property'),
        body('newPhase').optional().isString().withMessage("newPhase must be of string type"),
        body('status').optional().isString().withMessage("status must be of string type"),
        body('unavailableReason').optional().isString().withMessage("unavailableReason must be of string type")
    ], handle(controllers.process.updateProcess))

    // TODO - NEEDS TIMESTAMP
    /**
     * Add User to Request
     */
    router.post(`/${requests}/:id/${users}`, [
        verifyIfAuthenticated,
        body('userId').exists().isInt().withMessage("User Id must exist and be of int type"),
        body('roleId').exists().isInt().withMessage("Role Id must exist and be of int type")
    ], handle(controllers.request.postUser))

    // TODO - NEEDS TIMESTAMP
    /**
     * Update process phase notes
     */
    router.put(`/${requests}/:requestId/${candidates}/:candidateId/${process}/${phases}/:phase`, [
        verifyIfAuthenticated,
        ...processValidators,
        body('notes').isString().withMessage("Phase notes must be of string type")
    ], handle(controllers.process.updateProcessPhaseNotes))

    /**
     * Get workflow detail
     */
    router.get(`/${workflows}/:workflow`, [
        verifyIfAuthenticated,
        param('workflow').isString().withMessage("Workflow must be of string type")
    ], handle(controllers.requestProps.getWorkflow))

    /**
     * Get all phases
     */
    router.get(`/${phases}`, verifyIfAuthenticated, handle(controllers.phase.getPhases))


    /**
     * Get phase detail
     */
    router.get(`/${phases}/:phase`, [
        verifyIfAuthenticated,
        param('phase').isString().withMessage("Phase must be of string type")
    ], handle(controllers.phase.getPhase))

    /**
     * Get all skills
     */
    router.get(`/${requestAttributes}/${skills}`, verifyIfAuthenticated,
        handle(controllers.requestProps.getSkills))

    /**
     * Get all states
     */
    router.get(`/${requestAttributes}/${states}`, verifyIfAuthenticated,
        handle(controllers.requestProps.getStates))

    /**
     * Get all states-csl
     */
    router.get(`/${requestAttributes}/${statesCsl}`, verifyIfAuthenticated,
        handle(controllers.requestProps.getStatesCsl))

    /**
     * Get all projects
     */
    router.get(`/${requestAttributes}/${projects}`, verifyIfAuthenticated,
        handle(controllers.requestProps.getProjects))

    /**
     * Get all profiles
     */
    router.get(`/${requestAttributes}/${profiles}`, verifyIfAuthenticated,
        handle(controllers.requestProps.getProfiles))

    /**
     * Get all languages
     */
    router.get(`/${requestAttributes}/${languages}`, verifyIfAuthenticated,
        handle(controllers.requestProps.getLanguages))

    /**
     * Get all workflows
     */
    //TODO -> not consistent -> should be /workflows, instead of /requests-properties/workflows
    router.get(`/${requestAttributes}/${workflows}`, verifyIfAuthenticated,
        handle(controllers.requestProps.getWorkflows))

    /**
     * Get all months
     */
    router.get(`/${requestAttributes}/${months}`, verifyIfAuthenticated,
        handle(controllers.requestProps.getMonths))

    /**
     * Get all candidates
     */
    router.get(`/${candidates}`, [
        verifyIfAuthenticated,
        query('available').optional().isBoolean().withMessage("Available must be of boolean type"),
        query('profiles').optional().isString().withMessage("Profiles must be of string type separated by ','")
    ], handle(controllers.candidate.getCandidates))

    /**
     * Get candidate by id
     */
    router.get(`/${candidates}/:id`, verifyIfAuthenticated, handle(controllers.candidate.getCandidateById))

    /**
     * Download candidate's CV
     */
    router.get(`/${candidates}/:id/download-cv`, verifyIfAuthenticated, handle(controllers.candidate.downloadCandidateCv))

    // TODO - NEEDS TIMESTAMP
    /**
     * Update Candidate Info
     */
    router.patch(`/${candidates}/:id`, [
        verifyIfAuthenticated,
        upload.single('cv'),
        body('profileInfo').optional().isString().withMessage("Profile information must be of string type"),
        body('available').optional().isString().withMessage("Available must be of string type"),
        body('profiles').optional().isString().withMessage("Added profiles must be of string type")
    ], handle(controllers.candidate.updateCandidate))

    /**
     * Delete Candidate Profile
     */
    router.delete(`/${candidates}/:id/profiles/:profile`, [
        verifyIfAuthenticated,
        param('profile').isString().withMessage('Profile must be of type string')
    ], handle(controllers.candidate.removeCandidateProfile))

    /**
     * Create candidate
     */

    /*
    TODO -> Validators missing -> name and cv need to exist
     */
    router.post(`/${candidates}`, [
        verifyIfAuthenticated,
        upload.single('cv'),
        body('name').exists().isString().withMessage("Candidate Name must exist and be of string type"),
        body('profileInfo').optional().isString().withMessage("Candidate profile info must be of string type"),
        body('profiles').optional().isString().withMessage("Candidates profiles must be an array of profiles"),
        checkSchema({
            'cv': {
                custom: {
                    options: (value, {req}) => !!req.file,
                    errorMessage: 'Cv file needs to be uploaded',
                }
            }
        })
    ], handle(controllers.candidate.postCandidate))

    /*
    router.post(`/${candidates}/:id/profiles`, [
        body('profileToAdd').exists().isString().withMessage("Profile to add to candidate")
    ], handle(controllers.candidate.addProfileToCandidate))

    router.delete(`/${candidates}/:id/profiles/:profile`,
        handle(controllers.candidate.removeCandidateProfile))

     */

    //TODO -> CHANGE ROUTES
    router.get(`/process/reasons`, verifyIfAuthenticated, handle(controllers.process.getUnavailableReasons))

    router.get(`/process/status`, verifyIfAuthenticated, handle(controllers.process.getAllStatus))

    return router
}
