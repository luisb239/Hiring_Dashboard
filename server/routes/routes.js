'use strict'

const handle = require('../express-handler.js')
const verifyIfAuthenticated = require('../controllers/middlewares/verify_authenticated')

module.exports = function (router, controllers, authModule, upload, validator) {

    const {param, query} = validator

    const users = 'users'
    const roles = 'roles'
    const phases = 'phases'

    // request attributes
    const workflows = 'workflows'

    require('./auth-routes')(router, controllers.auth, authModule, handle)
    require('./requests-routes')(router, controllers.request, controllers.process, validator, handle, verifyIfAuthenticated)
    require('./request-props-routes')(router, controllers.requestProps, handle, verifyIfAuthenticated)
    require('./statistics-routes')(router, controllers.statistics, validator, handle, verifyIfAuthenticated)
    require('./candidates-routes')(router, controllers.candidate, validator, upload, handle, verifyIfAuthenticated)

    /**
     * Get all users + query filter
     */
    router.get(`/${users}`, [
        query('roleId').optional().isInt(),
    ], handle(controllers.user.getUsers))

    /**
     * Get role by name
     */
    router.get(`/${roles}`, [
        query('role').isString().withMessage("Role Name must be a string")
    ], handle(controllers.user.getRoleByName))


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

    router.get(`/process/reasons`, verifyIfAuthenticated, handle(controllers.process.getUnavailableReasons))

    router.get(`/process/status`, verifyIfAuthenticated, handle(controllers.process.getAllStatus))

    return router
}
