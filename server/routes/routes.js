'use strict'

const handle = require('../express-handler.js')
const verifyIfAuthenticated = require('../controllers/middlewares/verify_authenticated')

module.exports = function (router, controllers, authModule, upload, validator) {

    const {body, param, query, checkSchema} = validator

    const users = 'users'
    const roles = 'roles'
    const phases = 'phases'

    // request attributes
    const requestAttributes = 'requests-properties'
    const workflows = 'workflows'

    const authRouter = require('./auth-routes')(router, controllers.auth, authModule, handle)
    const requestsRouter = require('./requests-routes')(router, controllers.request, controllers.process, validator, handle, verifyIfAuthenticated)
    const requestsPropsRouter = require('./request-props-routes')(router, controllers.requestProps, handle, verifyIfAuthenticated)
    const statisticsRouter = require('./statistics-routes')(router, controllers.statistics, validator, handle, verifyIfAuthenticated)
    const candidatesRouter = require('./candidates-routes')(router, controllers.candidate, validator, upload, handle, verifyIfAuthenticated)

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
     * Get all workflows
     */
    //TODO -> not consistent -> should be /workflows, instead of /requests-properties/workflows
    router.get(`/${requestAttributes}/${workflows}`, verifyIfAuthenticated,
        handle(controllers.requestProps.getWorkflows))

    /*
    router.post(`/${candidates}/:id/profiles`, [
        body('profileToAdd').exists().isString().withMessage("Profile to add to candidate")
    ], handle(controllers.candidate.addProfileToCandidate))

    router.delete(`/${candidates}/:id/profiles/:profile`,
        handle(controllers.candidate.removeCandidateProfile))

     */

    //TODO -> Change routes names, maybe /reasons and /status..
    // or /process-unavailable-reasons and /process-status
    router.get(`/process/reasons`, verifyIfAuthenticated, handle(controllers.process.getUnavailableReasons))

    router.get(`/process/status`, verifyIfAuthenticated, handle(controllers.process.getAllStatus))

    return router
}
