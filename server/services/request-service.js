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

        // TODO -> Check if all arguments are valid... strings or numbers...

        const requests = await requestDb.getRequests({
            skill, state, stateCsl, profile, project,
            workflow, minQuantity, maxQuantity, minProgress, maxProgress
        })

        return {
            requests: requests
        }
    }

    async function getRequestById({id}) {
        if (!parseInt(id))
            throw new AppError(errors.invalidInput, "Invalid Request ID", "Request ID must be of integer type")

        const requestFound = await requestDb.getRequestById({id})
        if (!requestFound)
            throw new AppError(errors.resourceNotFound, "Request not found", `Request with id ${id} does not exist`)

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
                                     quantity, description, targetDate, state, skill, stateCsl,
                                     project, profile, workflow, dateToSendProfile = null,
                                     mandatoryLanguages = null, valuedLanguages = null
                                 }) {
        // Checking mandatory arguments
        if (!quantity)
            throw new AppError(errors.missingInput, "Missing Request Quantity", "You must supply a quantity")

        if (!description)
            throw new AppError(errors.missingInput, "Missing Request Description", "You must supply a description")

        if (!targetDate)
            throw new AppError(errors.missingInput, "Missing Request Target Date", "You must supply a target date")

        if (!state)
            throw new AppError(errors.missingInput, "Missing Request State", "You must supply a state")

        if (!skill)
            throw new AppError(errors.missingInput, "Missing Request SKill", "You must supply a skill")

        if (!stateCsl)
            throw new AppError(errors.missingInput, "Missing Request State Csl", "You must supply a state csl")

        if (!project)
            throw new AppError(errors.missingInput, "Missing Request Project", "You must supply a project")

        if (!profile)
            throw new AppError(errors.missingInput, "Missing Request Profile", "You must supply a profile")

        if (!workflow)
            throw new AppError(errors.missingInput, "Missing Request Workflow", "You must supply a workflow")

        if (!Number.isInteger(quantity))
            throw new AppError(errors.invalidInput, "Invalid Request Quantity", "Quantity must be of type integer")

        /*
        if (quantity < 1)
            throw new AppError(errors.invalidInput, "Quantity must be greater than 1")

         */

        //TODO -> FAZER RESTANTES VERIFICAÇÕES -> mandatory + valued languages array ... strings/numbers


        const request = await requestDb.createRequest({
            quantity, description, targetDate, state, skill, stateCsl, project, profile, workflow, dateToSendProfile
        })

        return {
            requestId: request.requestId,
            message: "Request created successfully"
        }
    }


    async function getRequestsByUserAndRole({userId, role}) {
        if (!parseInt(userId))
            throw new AppError(errors.invalidInput, "Invalid User ID", "User ID must be of integer type")

        if (parseInt(role))
            throw new AppError(errors.invalidInput, "Invalid Role", "Role must be of string type")

        if (!await userDb.getUserById({userId}))
            throw new AppError(errors.resourceNotFound, "User Not Found", `User with id ${userId} does not exist`)

        if (!await roleDb.getRole({role}))
            throw new AppError(errors.resourceNotFound, "Role Not Found", `Role ${role} does not exist`)

        const requests = await requestDb.getRequestsByUserAndRole({userId, role})
        return {requests: requests}
    }
}
