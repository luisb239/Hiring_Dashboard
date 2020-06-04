'use strict'

const errors = require('../errors/common-errors.js')
const AppError = require('../errors/app-error.js')

module.exports = (requestDb, candidateDb, userDb, roleDb) => {

    return {
        getRequests: getRequests,
        createRequest: createRequest,
        getRequestById: getRequestById,
        getRequestsByUserAndRole: getRequestsByUserAndRole,
    }

    async function getRequests({
                                   skill = null, state = null, stateCsl = null, profile = null,
                                   project = null, workflow = null, minQuantity = null, maxQuantity = null,
                                   minProgress = null, maxProgress = null
                               }) {

        const requests = await requestDb.getRequests({
            skill, state, stateCsl, profile, project,
            workflow, minQuantity, maxQuantity, minProgress, maxProgress
        })

        return {
            requests: requests
        }
    }

    async function getRequestById({id}) {
        const requestFound = await requestDb.getRequestById({id})
        if (!requestFound)
            throw new AppError(errors.notFound, "Request not found", `Request with id ${id} does not exist`)

        // TODO -> CALL user_roles_db instead
        // Get users (and their roles) in current request
        const userRoles = await requestDb.getUserRolesInRequest({requestId: id})

        // Get candidates in current request
        const candidates = await candidateDb.getCandidatesByRequestId({requestId: id})

        return {
            request: requestFound,
            userRoles: userRoles,
            candidates: candidates.map(candidate => ({id: candidate.id, name: candidate.name}))
        }
    }

    async function createRequest({
                                     quantity, description, targetDate,
                                     state = "Open", skill, stateCsl = "Asked",
                                     project, profile, workflow, dateToSendProfile = null
                                 }) {

        const request = await requestDb.createRequest({
            quantity, description, targetDate, state, skill, stateCsl,
            project, profile, workflow, dateToSendProfile, requestDate: new Date().toDateString(), progress: 0
        })
        return {
            id: request.id
        }

    }

    async function getRequestsByUserAndRole({userId, roleId}) {
        const requests = await requestDb.getRequestsByUserAndRole({userId, roleId})
        return {requests: requests}
    }

}
