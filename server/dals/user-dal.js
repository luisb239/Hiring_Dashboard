'use strict'

const user = require('../schemas/user-roles-schemas/user-schema.js')

module.exports = (query) => {

    return {
        getUserById: getUserById,
        createUser: createUser
    }

    function extractUser(row) {
        return {
            id: row[user.id],
            isActive: row[user.isActive]
        }
    }

    async function getUserById({userId}) {
        const statement = {
            name: 'Get User By Id',
            text:
                `SELECT * FROM ${user.table} ` +
                `WHERE ${user.id} = $1;`,
            values: [userId]
        }
        const result = await query(statement)

        if (result.rowCount) {
            return result.rows.map(row => extractUser(row))[0]
        }
        return null
    }

    async function createUser({userId, isActive = true}) {
        const statement = {
            name: 'Create User',
            text:
                `INSERT INTO ${user.table} (${user.id}, ${user.isActive}) VALUES ` +
                `($1, $2); `,
            values: [userId, isActive]
        }
        await query(statement)
    }
}
