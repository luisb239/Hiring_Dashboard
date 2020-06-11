'use strict'
/**
 *
 * @type {CustomError}
 */
const CustomError = require('./custom-error')

module.exports = {
    /**
     *
     * @param failedQuery
     * @returns {CustomError}
     */
    errorExecutingQuery: (failedQuery) => new CustomError(JSON.stringify({
        title: "Problem executing Query",
        detail: `There was a problem executing the query, check if all the data was inserted correctly. The failed Query was the following ${failedQuery}`,
        status: 400
    })),

    duplicateValues: new CustomError(JSON.stringify({
        title: "Duplicate Values",
        detail: "Value already inserted,Please choose another one",
        status: 403
    })),

    noUsersFound: new CustomError(JSON.stringify({
        title: "No users found",
        detail: "No users with these parameters are currently on the database",
        status: 404
    })),

    dbConnection: new CustomError(JSON.stringify({
        title: 'Database Connection Error',
        detail: 'An error occurred while establishing the connection to the database',
        status: 500
    })),

    userDuplicateActiveList: new CustomError(JSON.stringify({
        title: "User duplicate active list",
        detail: "User already has an active list, change active list status first before adding the user to a new list",
        status: 403
    })),

    noListFound: new CustomError(JSON.stringify({
        title: "No List found",
        detail: "query didn't go through because there were no lists found with this id",
        status: 404
    })),
    noValueFound: new CustomError(JSON.stringify({
        title: "No Value found",
        detail: "Query returned an empty value",
        status: 204
    })),
    userNotAuthenticated: new CustomError(JSON.stringify({
        title: "User is not authenticated",
        detail: "User tried to access a resource that requires authentication and he doesn't meet those requirements",
        status: 401
    })),

    userRoleNotFound: new CustomError(JSON.stringify({
        title: "User does not have roles",
        detail: "User tried to access a resource that requires a specific role and he doesn't meet those requirements",
        status: 404
    })),
    permissionNotFound: new CustomError(JSON.stringify({
        title: "Permissions does not exist",
        detail: "The permission that you are trying to acess does not exist in the database",
        status: 404
    })),
    permissionRolesNotFound :new CustomError(JSON.stringify({
        title: "Permission Is Not Associated with this Role",
        detail: "The permission that you are trying to acess is not associated with this role",
        status: 404
    })),
}
