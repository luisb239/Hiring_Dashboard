'use strict'

module.exports = function (router, requestPropsController, handle, verifyIfAuthenticated) {

    const root = 'requests-properties'
    const skills = 'skills'
    const states = 'states'
    const statesCsl = 'states-csl'
    const projects = 'projects'
    const profiles = 'profiles'
    const languages = 'languages'
    const months = 'months'

    /**
     * Get all skills
     */
    router.get(`/${root}/${skills}`, verifyIfAuthenticated, handle(requestPropsController.getSkills))

    /**
     * Get all states
     */
    router.get(`/${root}/${states}`, verifyIfAuthenticated, handle(requestPropsController.getStates))

    /**
     * Get all states-csl
     */
    router.get(`/${root}/${statesCsl}`, verifyIfAuthenticated, handle(requestPropsController.getStatesCsl))

    /**
     * Get all projects
     */
    router.get(`/${root}/${projects}`, verifyIfAuthenticated, handle(requestPropsController.getProjects))

    /**
     * Get all profiles
     */
    router.get(`/${root}/${profiles}`, verifyIfAuthenticated, handle(requestPropsController.getProfiles))

    /**
     * Get all languages
     */
    router.get(`/${root}/${languages}`, verifyIfAuthenticated, handle(requestPropsController.getLanguages))

    /**
     * Get all months
     */
    router.get(`/${root}/${months}`, verifyIfAuthenticated, handle(requestPropsController.getMonths))
}
