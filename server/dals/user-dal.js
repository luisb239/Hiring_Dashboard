'use strict'

const user = require('../schemas/user-roles-schemas/user-schema.js')

module.exports = (query) => {

    return {
        getUserById: getUserById
    }

    function extractUser(row) {
        return {
            id: row[user.id],
            username: row[user.username],
            createdAt: row[user.createdAt],
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
}
