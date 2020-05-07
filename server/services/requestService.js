'use strict'

const errors = require('../utils/errors/errors_type.js')
const AppError = require('../utils/errors/app_error.js')

module.exports = (db) => {

    return {
        getRequests: getRequests,
        createRequest: createRequest,
        getRequestById: getRequestById,
        getRequestsByUserAndRole : getRequestsByUserAndRole,
    }


    async function getRequests({skill = null, state = null, stateCsl = null, profile = null,
                                   project = null, workflow = null,
                                   minQuantity = null, maxQuantity = null,
                                   minProgress = null, maxProgress = null} = {}) {
        return await db.getRequests({
            skill, state, stateCsl, profile, project, workflow, minQuantity,
            maxQuantity, minProgress, maxProgress
        })
    }

    async function getRequestById({id}) {
        const requestFound = await db.getRequestById({id})

        if (!requestFound)
            throw new AppError(errors.resourceNotFound, "Request not found")

        return requestFound
    }

    async function createRequest({quantity, description, targetDate, state, skill, stateCsl,
                                     project, profile, workflow, dateToSendProfile = null} = {}) {

        if (!quantity) throw new AppError(errors.missingInput, "You must supply a quantity")

        if (!description) throw new AppError(errors.missingInput, "You must supply a description")

        if (!targetDate) throw new AppError(errors.missingInput, "You must supply a target date")

        if (!state) throw new AppError(errors.missingInput, "You must supply the request state")

        if (!skill) throw new AppError(errors.missingInput, "You must supply the request skill")

        if (!stateCsl) throw new AppError(errors.missingInput, "You must supply the request stateCsl")

        if (!project) throw new AppError(errors.missingInput, "You must supply the request project")

        if (!profile) throw new AppError(errors.missingInput, "You must supply the request profile")

        if (!workflow) throw new AppError(errors.missingInput, "You must supply the request workflow")

        return await db.createRequest({
            quantity, description, targetDate, state, skill, stateCsl, project, profile, workflow, dateToSendProfile
        })
    }

    async function getRequestsByUserAndRole({userId, roleId}) {
        // Check if User and Role exist??
        return await db.getRequestsByUserAndRole({userId, roleId})
    }
}
