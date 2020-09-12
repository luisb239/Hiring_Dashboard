'use strict'

const DbError = require('../dals/errors/db-access-error')
const dbCommonErrors = require('../dals/errors/db-errors.js')

const errors = require('./errors/common-errors.js')
const AppError = require('./errors/app-error.js')

module.exports = (requestDb, processDb, requestLanguagesDb, authModule, candidateDb, emailService, transaction) => {

    return {
        getRequests: getRequests,
        createRequest: createRequest,
        getRequestById: getRequestById,
        addRequestToUser: addRequestToUser,
        addUserToRequest: addUserToRequest,
        updateRequest: updateRequest,
        deleteLanguage: deleteLanguage,
        countRequests: countRequests,
        addLanguageToRequest: addLanguageToRequest
    }

    /**
     * Get requests info based on filters passed
     * @param pageNumber: ?number
     * @param pageSize: ?number
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
                               } = {}) {

        const requests = await requestDb.getRequests({
            pageNumber, pageSize,
            skill, state, stateCsl, profile, project, workflow, minQuantity,
            maxQuantity, minProgress, maxProgress, targetDate, userId
        })

        return {
            requests
        }
    }

    async function countRequests({
                                     skill = null, state = null, stateCsl = null,
                                     profile = null, project = null, workflow = null,
                                     minQuantity = null, maxQuantity = null,
                                     minProgress = null, maxProgress = null,
                                     targetDate = null, userId = null
                                 } = {}) {
        const result = await requestDb.countRequests({
            skill, state, stateCsl, profile, project, workflow, minQuantity,
            maxQuantity, minProgress, maxProgress, targetDate, userId
        })
        return {count: result.count};
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

        const userRoles = await requestDb.getUserRolesInRequest({requestId: id})

        const candidates = await candidateDb.getCandidatesByRequestId({requestId: id});

        const processes = await Promise.all(candidates.map(async (candidate) => {
            const processDetails = await processDb.getProcessStatusAndTimestamp({
                requestId: id,
                candidateId: candidate.id
            })
            return {
                candidate: ({
                    id: candidate.id,
                    name: candidate.name
                }),
                status: processDetails.status,
                timestamp: processDetails.timestamp
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

        try {
            const request = await requestDb.createRequest({
                quantity, description, targetDate, state: "Open", skill, stateCsl: "Asked",
                project, profile, workflow, dateToSendProfile, progress: 0
            })
            return {
                id: request.id
            }
        } catch (e) {
            if (e instanceof DbError) {
                if (e.type === dbCommonErrors.foreignKeyViolation) {
                    throw new AppError(errors.invalidArguments, "Could not create request",
                        "The arguments you supplied are not valid. Try again with valid arguments.", e.stack)
                }
            }
            throw e;
        }
    }

    async function updateRequest({
                                     id, timestamp, state = null, stateCsl = null, description = null,
                                     quantity = null, targetDate = null, skill = null, project = null,
                                     profile = null, dateToSendProfile = null
                                 }) {

        const request = await requestDb.getRequestById({id: id})
        if (!request) {
            throw new AppError(errors.notFound, "Request not found",
                `Request with id ${id} does not exist`)
        }
        if (request.timestamp !== timestamp) {
            throw new AppError(errors.conflict, "Request not updated",
                `Request with id ${id} has already been updated`)
        }

        return await transaction(async (client) => {
            let newTimestamp;

            // Trying to update request
            try {
                newTimestamp = await requestDb.updateRequest({
                    id, state, stateCsl, description, quantity,
                    targetDate, skill, project, profile, dateToSendProfile, observedTimestamp: timestamp, client
                })
            } catch (e) {
                if (e instanceof DbError) {
                    if (e.type === dbCommonErrors.foreignKeyViolation) {
                        throw new AppError(errors.invalidArguments, "Could not update request",
                            "The arguments you supplied are not valid. Try again with valid arguments.", e.stack)
                    }
                }
                throw e;
            }

            // Other transaction already updated the request
            if (!newTimestamp) {
                throw new AppError(errors.conflict,
                    "Request not updated",
                    `Request with id ${id} has already been updated`)
            }

            return {
                newTimestamp
            }
        })
    }


    // The current user is either a job owner or an admin, or both
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
        try {
            await requestDb.addUserAndRoleToRequest({userId, roleId, requestId})
            const request = await requestDb.getRequestById({id: requestId})
            await emailService.notifyAssigned({userId, request, currentUsername})
        } catch (e) {
            if (e instanceof DbError) {
                if (e.type === dbCommonErrors.uniqueViolation) {
                    throw new AppError(errors.conflict, "Could not add user, with role supplied, to request",
                        `Request ${requestId} already has user ${userId} with role ${roleId}.`, e.stack)
                }
                if (e.type === dbCommonErrors.foreignKeyViolation) {
                    throw new AppError(errors.invalidArguments, "Could not add user, with role supplied, to request",
                        "The arguments you supplied are not valid. Try again with valid arguments.", e.stack)
                }
            }
            throw e;
        }
    }

    async function addLanguageToRequest({requestId, language, isMandatory}) {
        try {
            await requestLanguagesDb.createLanguageRequirement({requestId, language, isMandatory})
        } catch (e) {
            if (e instanceof DbError) {
                if (e.error && e.error === dbCommonErrors.detailErrors.uniqueViolation) {
                    throw new AppError(errors.conflict,
                        "Cannot add language requirement to current request",
                        `Request ${requestId} already has ${language} as request's `
                        + isMandatory ? 'mandatory' : 'valued' + ' language')
                }
                throw e;
            }
        }

    }

    async function deleteLanguage({requestId, language, isMandatory}) {
        const deleted = await requestLanguagesDb.deleteLanguageRequirement({requestId, language, isMandatory})
        if (!deleted) {
            const str = isMandatory ? 'Mandatory' : 'Valued';
            throw new AppError(errors.gone,
                "Could not delete language requirement from request",
                `${str} ${language} requirement on request ${requestId} not found`)
        }
    }

}
