'use strict'

module.exports = function (global, router, controllers) {

    const users = 'users'
    const roles = 'roles'
    const candidates = 'candidates'
    const requests = 'requests'
    const phases = 'phases'

    // request attributes
    const requestAttributes = 'requests-properties'
    const skills = 'skills'
    const states = 'states'
    const statesCsl = 'states-csl'
    const projects = 'projects'
    const profiles = 'profiles'
    const languages = 'languages'
    const workflows = 'workflows'

    // Get Requests + Query Filter
    router.get(`/${requests}`, controllers.request.getRequests)

    // Get Request By Id
    router.get(`/${requests}/:id`, controllers.request.getRequestById)

    // Create Request
    router.post(`/${requests}`, controllers.request.postRequest)

    // Update Request TODO
    // router.put(`/${requests}/:id`, )

    router.get(`/${requestAttributes}/${skills}`, controllers.skill.getSkills)
    router.get(`/${requestAttributes}/${states}`, controllers.state.getStates)
    router.get(`/${requestAttributes}/${statesCsl}`, controllers.stateCsl.getStatesCsl)
    router.get(`/${requestAttributes}/${projects}`, controllers.project.getProjects)
    router.get(`/${requestAttributes}/${profiles}`, controllers.profile.getProfiles)
    router.get(`/${requestAttributes}/${languages}`, controllers.language.getLanguages)
    router.get(`/${requestAttributes}/${workflows}`, controllers.workflow.getWorkflows)

    // Get Candidates + Available Filter
    router.get(`/${candidates}`, controllers.candidate.getCandidates)

    // Get Candidate by id
    router.get(`/${candidates}/:id`, controllers.candidate.getCandidateById)

    // Update Candidate
    // router.put(`/${candidates}/:id`, controllers.candidate.putCandidate)

    // Get Candidates In Request + Available Filter
    router.get(`/${requests}/:id/${candidates}`, controllers.candidate.getCandidatesByRequest)

    // Get Candidates By Phase Of Request + Filter ??
    /*
    router.get(`/${requests}/:id/${phases}/:phaseId/${phases}/${candidates}`,
        controllers.candidate.getCandidatesByRequestPhase)
     */

    // Create Candidate
    router.post(`/${candidates}`, controllers.candidate.postCandidate)

    return router
}
