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
        /*
    } catch (e) {
        // Optimista

        // error occurred -> lets see what the error was and throw it


        if (!await skillDao.getSkill({skill}))
            throw new AppError(errors.notFound, "Skill Not Found", `Skill ${skill} does not exist`)

        if (!await projectDao.getProject({project}))
            throw new AppError(errors.notFound, "Project Not Found", `Project ${project} does not exist`)

        if (!await profileDao.getProfile({project}))
            throw new AppError(errors.notFound, "Profile Not Found", `Profile ${project} does not exist`)

        if (!await workflowDao.getWorkflow({workflow}))
            throw new AppError(errors.notFound, "Workflow Not Found", `Workflow ${workflow} does not exist`)



        throw new AppError(errors.databaseDown, "Service Unavailable", "Database is currently down. Please try again later")
    }
    */

    }

    async function getRequestsByUserAndRole({userId, roleId}) {
        /*
        if (!parseInt(userId))
            throw new AppError(errors.invalidInput, "Invalid User ID", "User ID must be of integer type")

        if (parseInt(role))
            throw new AppError(errors.invalidInput, "Invalid Role", "Role must be of string type")
         */

        /*
        if (!await userDb.getUserById({userId}))
            throw new AppError(errors.notFound, "User Not Found", `User with id ${userId} does not exist`)

        if (!await roleDb.getRole({role}))
            throw new AppError(errors.notFound, "Role Not Found", `Role ${role} does not exist`)
         */

        const requests = await requestDb.getRequestsByUserAndRole({userId, roleId})
        return {requests: requests}
    }

}
