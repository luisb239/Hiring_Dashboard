'use strict'

const errors = require('./errors/common-errors.js')
const AppError = require('./errors/app-error.js')

module.exports = (requestDb, processDb, requestLanguagesDb, authModule, candidateDb, emailService, transaction) => {

    return {
        getRequests: getRequests,
        createRequest: createRequest,
        getRequestById: getRequestById,
        addLanguagesToRequest: addLanguagesToRequest,
        addRequestToUser: addRequestToUser,
        addUserToRequest: addUserToRequest,
        updateRequest: updateRequest,
        updateRequestLanguages: updateRequestLanguages,
        deleteLanguage: deleteLanguage,
        countRequests: countRequests,
        teste
    }

    /**
     * Get requests info based on filters passed
     * @param pageNumber
     * @param pageSize
     * @param skill : String
     * @param state : String
     * @param stateCsl : String
     * @param profile : String
     * @param project : String
     * @param workflow : String
     * @param minQuantity : ?number
     * @param maxQuantity : ?number
     * @param minProgress : ?number
     * @param maxProgress : ?number
     * @param targetDate : String
     * @param userId : ?number
     */
    async function getRequests({
                                   pageNumber = null, pageSize = null,
                                   skill = null, state = null, stateCsl = null,
                                   profile = null, project = null, workflow = null,
                                   minQuantity = null, maxQuantity = null,
                                   minProgress = null, maxProgress = null,
                                   targetDate = null, userId = null
                               }) {
        return {
            requests: await requestDb.getRequests({
                pageNumber, pageSize,
                skill, state, stateCsl, profile, project, workflow, minQuantity,
                maxQuantity, minProgress, maxProgress, targetDate, userId
            })
        }
    }

    /**
     * Get Info of Request with id
     * @param id : number - Request ID
     */
    async function getRequestById({id}) {
        const requestFound = await requestDb.getRequestById({id})

        if (!requestFound)
            throw new AppError(errors.notFound,
                "Request not found",
                `Request with id ${id} does not exist`)

        // TODO -> CALL user_roles_db instead
        // Get users (and their roles) in current request
        const userRoles = await requestDb.getUserRolesInRequest({requestId: id})

        const candidates = await candidateDb.getCandidatesByRequestId({requestId: id});

        const processes = await Promise.all(candidates.map(async (candidate) => {
            const status = await processDb.getProcessStatus({requestId: id, candidateId: candidate.id})
            return {
                candidate: ({
                    id: candidate.id,
                    name: candidate.name
                }),
                status: status.status
            }
        }))

        const languages = (await requestLanguagesDb.getRequestLanguages({requestId: id}))
            .map(l => ({
                language: l.language,
                isMandatory: l.isMandatory
            }))

        return {
            request: requestFound,
            userRoles: userRoles,
            processes: processes,
            languages: languages
        }
    }

    async function createRequest({
                                     quantity, description, targetDate, skill,
                                     project, profile, workflow, dateToSendProfile = null
                                 }) {

        const request = await requestDb.createRequest({
            quantity, description, targetDate, state: "Open", skill, stateCsl: "Asked",
            project, profile, workflow, dateToSendProfile, progress: 0
        })

        return {
            id: request.id
        }

    }

    // TODO -> Check if successful ...
    async function updateRequest({
                                     id, quantity, targetDate,
                                     state, skill, stateCsl,
                                     project, profile, dateToSendProfile
                                 }) {

        await requestDb.updateRequest({
            id, quantity, targetDate, state, skill,
            stateCsl, project, profile, dateToSendProfile
        })
    }

    //TODO -> TRY CATCH..DUPLICATE, FOREIGN KEY, ...
    async function addLanguagesToRequest({requestId, languages, isMandatory}) {
        await Promise.all(languages.map(async (l) =>
            await requestLanguagesDb.createLanguageRequirement({requestId, language: l, isMandatory})))
    }

    // The current user is either a job owner or an admin, or both
    // TODO -> Middlewares constraints needed!!
    async function addRequestToUser({userId, requestId}) {
        const userRoles = await authModule.userRole.getUserActiveRoles(userId);
        let userRoleToAddToRequest;
        const adminRole = await authModule.role.getByName("admin")
        if (userRoles.find(userRole => userRole.RoleId === adminRole.id)) {
            // user has admin permissions
            userRoleToAddToRequest = adminRole.id;
        } else {
            // user does not have admin permissions, so the role left is job owner
            const jobOwner = await authModule.role.getByName("jobOwner")
            userRoleToAddToRequest = jobOwner.id;
        }
        await requestDb.addUserAndRoleToRequest({userId: userId, roleId: userRoleToAddToRequest, requestId: requestId})
    }

    async function addUserToRequest({requestId, userId, roleId, currentUsername}) {
        await requestDb.addUserAndRoleToRequest({userId, roleId, requestId})
        const request = await requestDb.getRequestById({id: requestId})
        await emailService.notifyAssigned({userId, request, currentUsername})
    }

    async function updateRequestLanguages({requestId, languages, isMandatory}) {
        await Promise.all(languages.map(async (l) =>
            await requestLanguagesDb.createLanguageRequirement({requestId, language: l, isMandatory})))
    }

    async function deleteLanguage({requestId, language, isMandatory}) {
        await requestLanguagesDb.deleteLanguage({requestId, language, isMandatory})
    }

    async function countRequests({
                                     skill = null, state = null, stateCsl = null,
                                     profile = null, project = null, workflow = null,
                                     minQuantity = null, maxQuantity = null,
                                     minProgress = null, maxProgress = null,
                                     targetDate = null, userId = null
                                 }) {
        const result = await requestDb.countRequests({
                skill, state, stateCsl, profile, project, workflow, minQuantity,
                maxQuantity, minProgress, maxProgress, targetDate, userId
            })
        return {count: result.count};
    }

    async function teste({char1, char2, int, timestamp}) {
        return await transaction(async (client) => {
            const res = await requestDb.insertA(char1, client, timestamp)
            console.log(res)
            await requestDb.insertB({char2, int}, client)
            return {str: 'HELLO'}
        })
    }
}
