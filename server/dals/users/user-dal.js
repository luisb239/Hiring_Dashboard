'use strict'

const user = require('../../schemas/user-roles-schemas/user-schema.js')
const userRole = require('../../schemas/user-roles-schemas/user-role-schema.js')

module.exports = (query) => {

    return {
        getUsers: getUsers,
        getUserById: getUserById,
        createUser: createUser
    }

    function extractUser(row) {
        return {
            id: row[user.id],
            email: row[user.email],
            isActive: row[user.isActive]
        }
    }

    async function getUsers({ roleId }) {
        const statement = {
            name: 'Get Users',
            text:
                `SELECT U.* FROM ${user.table} AS U ` +
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
                `SELECT * FROM ${user.table} ` +
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
                `INSERT INTO ${user.table} (${user.id}, ${user.email}, ${user.isActive}) VALUES ` +
                `($1, $2, $3);`,
            values: [userId, email, isActive]
        }
        await query(statement)
    }
}
