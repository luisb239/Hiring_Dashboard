'use strict'

module.exports = function (router, requestsController, processController, validator, handle, verifyIfAuthenticated) {

    const root = 'requests'
    const candidates = 'candidates'
    const process = 'process'
    const users = 'users'
    const phases = 'phases'

    const {body, query, param} = validator

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
        param('id').isInt()
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
        body('dateToSendProfile').optional().toDate(),
    ], handle(requestsController.postRequest))

    /**
     * Update Request
     */
    router.patch(`/${root}/:id`, [
        param('id').isInt(),
        body('timestamp').exists().withMessage("Timestamp must exist"),
        body('state').optional(),
        body('stateCsl').optional(),
        body('description').optional(),
        body('quantity').optional(),
        body('targetDate').optional(),
        body('skill').optional(),
        body('project').optional(),
        body('profile').optional(),
        body('dateToSendProfile').optional().toDate(),
    ], handle(requestsController.patchRequest))

    /**
     * Add language to request
     */
    router.post(`/${root}/:id/languages`, [
        verifyIfAuthenticated,
        param('id').isInt(),
        body('language').exists().isString().withMessage("Language to add must exist and be of type string"),
        body('isMandatory').exists().isBoolean().withMessage("IsMandatory must exist and be of boolean type")
    ], handle(requestsController.addLanguageToRequest))

    /**
     * Remove languages from request
     */
    router.delete(`/${root}/:id/languages/:language`, [
        verifyIfAuthenticated,
        param('id').isInt(),
        param('language').isString(),
        query('isMandatory').exists().isBoolean().withMessage("Language Mandatory boolean must exist on the query and be of type boolean")
    ], handle(requestsController.deleteLanguage))

    /**
     * Add User to Request
     */
    // TODO -> Change route to /requests/id (no need for /users)
    router.post(`/${root}/:id/${users}`, [
        verifyIfAuthenticated,
        param('id').isInt(),
        body('userId').exists().isInt().withMessage("User Id must exist and be of int type"),
        body('roleId').exists().isInt().withMessage("Role Id must exist and be of int type"),
    ], handle(requestsController.addUserToRequest))

    // TODO -> DELETE USER FROM REQUEST ENDPOINT MISSING

    /**
     * Get all request's processes
     */
    router.get(`/${root}/:id/processes`, [
        verifyIfAuthenticated,
        param('id').isInt(),
    ], handle(processController.getProcessesByRequestId))

    /**
     * Get process detail
     */
    router.get(`/${root}/:requestId/${candidates}/:candidateId/${process}`, [
        verifyIfAuthenticated,
        param('requestId').isInt(),
        param('candidateId').isInt(),
    ], handle(processController.getProcessDetail))

    /**
     * Create process
     */
    router.post(`/${root}/:requestId/${candidates}/:candidateId/${process}`, [
        verifyIfAuthenticated,
        param('requestId').isInt(),
        param('candidateId').isInt(),
    ], handle(processController.createProcess))

    /**
     * Update process
     */
    router.patch(`/${root}/:requestId/${candidates}/:candidateId/${process}`, [
        verifyIfAuthenticated,
        param('requestId').isInt(),
        param('candidateId').isInt(),
        body('infos').optional().isArray()
            .custom(infosArray => infosArray.every(info => info.name && info.value != null))
            .withMessage('Infos must be an array, with each element containing a name and a value property'),
        body('newPhase').optional().isString().withMessage("newPhase must be of string type"),
        body('status').optional().isString().withMessage("status must be of string type"),
        body('unavailableReason').optional().isString().withMessage("unavailableReason must be of string type"),
        body('timestamp').exists().withMessage("timestamp must exist")
    ], handle(processController.updateProcess))

    /**
     * Update process phase notes
     */
    router.put(`/${root}/:requestId/${candidates}/:candidateId/${process}/${phases}/:phase`, [
        verifyIfAuthenticated,
        param('requestId').isInt(),
        param('candidateId').isInt(),
        param('phase').isString(),
        body('notes').isString().withMessage("Phase notes must be of string type"),
        body('timestamp').exists().withMessage("timestamp must exist")
    ], handle(processController.updateProcessPhaseNotes))
}
