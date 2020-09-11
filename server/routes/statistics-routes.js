'use strict'

module.exports = function (router, controller, validator, handle, verifyIfAuthenticated) {

    const root = 'statistics'

    const {body, param} = validator

    /**
     * Get statistics of all requests
     */
    router.get(`/${root}`, verifyIfAuthenticated, handle(controller.getStatistics))

    /**
     * Get user's statistics configs
     */
    router.get(`/${root}/configs`, verifyIfAuthenticated, handle(controller.getUserStatisticsConfigs))

    /**
     * Save user's statistics configs
     */
    router.post(`/${root}/configs`, [
        verifyIfAuthenticated,
        body('name').exists().isString().withMessage('Config to save must have a name'),
        body('report').exists().withMessage('Must send the report to save')
    ], handle(controller.saveUserStatisticsConfigs))

    /**
     * Get user's statistics configs details
     */
    router.get(`/${root}/configs/:name`, [
        verifyIfAuthenticated,
        param('name').isString()
    ], handle(controller.getUserStatisticsConfigsDetails))

    // TODO -> DELETE USER STATISTICS CONFIGS PROFILE MISSING!!
}
