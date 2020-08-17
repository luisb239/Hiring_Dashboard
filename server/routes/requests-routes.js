'use strict'

module.exports = function (router, requestsController, processController, validator, handle, verifyIfAuthenticated) {

    const root = 'requests'
    const candidates = 'candidates'
    const process = 'process'
    const users = 'users'
    const phases = 'phases'

    const {body, query} = validator

    /**
     * Get all requests + query filter
     */
    router.get(`/${root}`, [
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
    ], handle(requestsController.getRequests))

    router.get(`/${root}/count`, [
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
    ], handle(requestsController.countRequests))

    /**
     * Get request by id
     */
    router.get(`/${root}/:id`, [
        verifyIfAuthenticated,
    ], handle(requestsController.getRequestById))

    /**
     * Create request
     */
    router.post(`/${root}`, [
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
    ], handle(requestsController.postRequest))

    /**
     * Update Request
     */
    router.patch(`/${root}/:id`, [
        body('timestamp').exists().toDate().withMessage("Timestamp must exist and be of date type"),
        body('quantity').optional(),
        body('targetDate').optional(),
        body('skill').optional(),
        body('project').optional(),
        body('profile').optional(),
        body('dateToSendProfile').optional().toDate(),
        body('mandatoryLanguages').optional().isArray(),
        body('valuedLanguages').optional().isArray()
    ], handle(requestsController.patchRequest))

    /**
     * Remove Language From Request
     */
    router.delete(`/${root}/:id/languages`, [
        query('language').exists().isString().withMessage("Language must exist and be a string"),
        query('isMandatory').exists().isBoolean().withMessage("Language Mandatory must exist and be a boolean")
    ], handle(requestsController.deleteLanguage))

    /**
     * Add User to Request
     */
    // TODO -> Change route to /requests/id (no need for /users)
    router.post(`/${root}/:id/${users}`, [
        verifyIfAuthenticated,
        body('userId').exists().isInt().withMessage("User Id must exist and be of int type"),
        body('roleId').exists().isInt().withMessage("Role Id must exist and be of int type"),
        body('timestamp').exists().toDate().withMessage("timestamp must exist and must be of date type")
    ], handle(requestsController.addUserToRequest))

    // TODO -> DELETE USER FROM REQUEST ENDPOINT MISSING

    /**
     * Get all request's processes
     */
    router.get(`/${root}/:id/processes`,
        verifyIfAuthenticated,
        handle(processController.getProcessesByRequestId))

    /**
     * Get process detail
     */
    router.get(`/${root}/:requestId/${candidates}/:candidateId/${process}`,
        verifyIfAuthenticated,
        handle(processController.getProcessDetail))

    /**
     * Create process
     */
    router.post(`/${root}/:requestId/${candidates}/:candidateId/${process}`,
        verifyIfAuthenticated,
        handle(processController.createProcess))

    /**
     * Update process
     */
    router.put(`/${root}/:requestId/${candidates}/:candidateId/${process}`, [
        verifyIfAuthenticated,
        body('infos').optional().isArray()
            .custom(infosArray => infosArray.every(info => info.name && info.value != null))
            .withMessage('Infos must be an array, with each element containing a name and a value property'),
        body('newPhase').optional().isString().withMessage("newPhase must be of string type"),
        body('status').optional().isString().withMessage("status must be of string type"),
        body('unavailableReason').optional().isString().withMessage("unavailableReason must be of string type"),
        body('timestamp').exists().toDate().withMessage("timestamp must exist and must be of date type")
    ], handle(processController.updateProcess))

    /**
     * Update process phase notes
     */
    router.put(`/${root}/:requestId/${candidates}/:candidateId/${process}/${phases}/:phase`, [
        verifyIfAuthenticated,
        body('notes').isString().withMessage("Phase notes must be of string type"),
        body('timestamp').exists().toDate().withMessage("timestamp must exist and must be of date type")
    ], handle(processController.updateProcessPhaseNotes))
}