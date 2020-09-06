'use strict'

module.exports = function (router, candidatesController, validator, upload, handle, verifyIfAuthenticated) {

    const root = 'candidates'

    const { body, query, checkSchema } = validator

    /**
     * Get all candidates
     */
    router.get(`/${root}`, [
        verifyIfAuthenticated,
        query('pageNumber').optional().isInt(),
        query('pageSize').optional().isInt(),
        query('available').optional().isBoolean().withMessage("Available must be of boolean type"),
        query('profiles').optional().isString().withMessage("Profiles must be of string type separated by ','"),
        query('notInRequest').optional().isInt()
    ], handle(candidatesController.getCandidates))

    router.get(`/${root}/count`, [
        verifyIfAuthenticated,
        query('available').optional().isBoolean().withMessage("Available must be of boolean type"),
        query('profiles').optional().isString().withMessage("Profiles must be of string type separated by ','"),
        query('notInRequest').optional().isInt(),
    ], handle(candidatesController.countCandidates))

    /**
     * Get candidate by id
     */
    router.get(`/${root}/:id`, verifyIfAuthenticated, handle(candidatesController.getCandidateById))

    /**
     * Download candidate's CV
     */
    router.get(`/${root}/:id/download-cv`, verifyIfAuthenticated, handle(candidatesController.downloadCandidateCv))


    /**
     * Update Candidate Info
     */
    router.patch(`/${root}/:id`, [
        verifyIfAuthenticated,
        upload.single('cv'),
        body('profileInfo').optional().isString().withMessage("Profile information must be of string type"),
        body('available').optional().isString().withMessage("Available must be of string type"),
        body('timestamp').exists().withMessage("timestamp must exist and must be of date type")
    ], handle(candidatesController.updateCandidate))

    /**
     * Add Candidate Profile
     */
    router.post(`/${root}/:id/profiles`, [
        verifyIfAuthenticated,
        body('profile').exists().isString().withMessage('Added profile must be of string type')
    ], handle(candidatesController.addCandidateProfile));

    /**
     * Delete Candidate Profile
     */
    router.delete(`/${root}/:id/profiles/:profile`,
        verifyIfAuthenticated,
        handle(candidatesController.removeCandidateProfile))

    /**
     * Create candidate
     */
    router.post(`/${root}`, [
        verifyIfAuthenticated,
        upload.single('cv'),
        checkSchema({
            'cv': {
                custom: {
                    options: (value, { req }) => !!req.file,
                    errorMessage: 'Cv file needs to be uploaded',
                }
            }
        }),
        body('name').exists().isString().withMessage("Candidate name must exist and be of string type"),
        body('profileInfo').optional().isString().withMessage("Candidate profile info must be of string type"),
        /* body('profiles').optional().isString().withMessage("Candidates profiles must be an array of profiles"), */
    ], handle(candidatesController.postCandidate))

}
