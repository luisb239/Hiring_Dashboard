'use strict'

const errors = require('./errors/common-errors.js')
const AppError = require('./errors/app-error.js')

module.exports = (requestDb, processDb, requestLanguagesDb, authModule, candidateDb) => {

    return {
        getRequests: getRequests,
        createRequest: createRequest,
        getRequestById: getRequestById,
        addLanguagesToRequest: addLanguagesToRequest,
        addRequestToUser: addRequestToUser,
        addUserAsRecruiterToRequest: addUserAsRecruiterToRequest
    }

    /**
     * Get requests info based on filters passed
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
     * @param roleId : ?number
     */
    async function getRequests({
                                   skill = null, state = null, stateCsl = null,
                                   profile = null, project = null, workflow = null,
                                   minQuantity = null, maxQuantity = null,
                                   minProgress = null, maxProgress = null,
                                   targetDate = null, userId = null, roleId = null
                               }) {
        return {
            requests: await requestDb.getRequests({
                skill, state, stateCsl, profile, project, workflow, minQuantity,
                maxQuantity, minProgress, maxProgress, targetDate, userId, roleId
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
        const requestUserRoles = await requestDb.getUserRolesInRequest({requestId: id})

        const userRoles = await Promise.all(requestUserRoles.map(async userRole => {
            const userInfo = await authModule.user.getById(userRole.userId)
            const roleInfo = await authModule.role.getSpecificById(userRole.roleId)
            return {
                userId: userRole.userId,
                email: userInfo.username,
                roleId: userRole.roleId,
                role: roleInfo.role
            }
        }))

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

    //TODO -> TRY CATCH..DUPLICATE, FOREIGN KEY, ...
    async function addLanguagesToRequest({requestId, languages, isMandatory}) {
        await Promise.all(languages.map(async (l) =>
            await requestLanguagesDb.createLanguageRequirement({requestId, language: l, isMandatory})))
    }

    async function addRequestToUser({userId, requestId}) {
        // get user roles
        // TODO -> which role do we choose? job owner or admin, or other in between??
        const userRoles = await authModule.userRole.getUserActiveRoles(userId);
        await requestDb.addUserAndRoleToRequest({userId: userId, roleId: userRoles[0].RoleId, requestId: requestId})
    }

    async function addUserAsRecruiterToRequest({requestId, userId, roleId}) {
        await requestDb.addUserAndRoleToRequest({userId, roleId, requestId})
    }

}
