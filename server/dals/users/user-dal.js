'use strict'

const userProfile = require('../../schemas/user-roles-schemas/user-profile-schema.js')
const userRole = require('../../schemas/user-roles-schemas/user-role-schema.js')
const userRoleRequest = require('../../schemas/user-roles-schemas/user-role-request-schema.js')
const user = require('../../schemas/user-roles-schemas/user-schema.js')

module.exports = (query) => {

    return {
        getUsers: getUsers,
        getUserById: getUserById,
        createUser: createUser,
        getUsersInRequest: getUsersInRequest
    }

    function extractUser(row) {
        return {
            id: row[userProfile.id],
            email: row[userProfile.email],
            isActive: row[userProfile.isActive]
        }
    }

    async function getUsers({ roleId }) {
        const statement = {
            name: 'Get Users',
            text:
                `SELECT U.* FROM ${userProfile.table} AS U ` +
                `INNER JOIN ${userRole.table} AS UR ON ` +
                `U.${user.id} = UR.${userRole.userId} ` +
                `WHERE UR.${userRole.roleId} = $1;`,
            values: [roleId]
        }
        const result = await query(statement)
        return result.rows.map(row => extractUser(row))
    }


    async function getUserById({ userId }) {
        const statement = {
            name: 'Get User By Id',
            text:
                `SELECT * FROM ${userProfile.table} ` +
                `WHERE ${user.id} = $1;`,
            values: [userId]
        }
        const result = await query(statement)

        if (result.rowCount) {
            return extractUser(result.rows[0])
        }
        return null
    }

    async function createUser({ userId, email, isActive = true }) {
        const statement = {
            name: 'Create User',
            text:
                `INSERT INTO ${userProfile.table} (${userProfile.id}, ${userProfile.email}, ${userProfile.isActive}) VALUES ` +
                `($1, $2, $3);`,
            values: [userId, email, isActive]
        }
        await query(statement)
    }

    async function getUsersInRequest({id}) {
        const statement = {
            name: 'Get Request Users',
            text:
                `SELECT DISTINCT U.${user.username} FROM ${user.table} AS U ` +
                `INNER JOIN ${userRoleRequest.table} AS URR ` +
                `ON U.${user.id} = URR.${userRoleRequest.userId} ` +
                `WHERE URR.${userRoleRequest.requestId} = $1;`
            ,
            values: [id]
        }
        const result = await query(statement)

        if (result.rowCount) {
            return result.rows.map(row => extractUsername(row))
        }
        return null
    }

    function extractUsername(row) {
        return row[user.username]
    }
}
