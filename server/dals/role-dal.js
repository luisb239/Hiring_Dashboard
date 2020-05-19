'use strict'

const roleSchema = require('../schemas/user-roles-schemas/role-schema.js')

module.exports = (query) => {

    return {
        getRole: getRole
    }

    async function getRole({role}) {
        const statement = {
            name: 'Get Role',
            text:
                `SELECT * FROM ${roleSchema.table} ` +
                `WHERE ${roleSchema.role} = $1;`,
            values: [role]
        }
        const result = await query(statement)

        if (result.rowCount) {
            return result.rows.map(row => extractRole(row))[0]
        }
        return null
    }

    function extractRole(row) {
        return {
            role: row[roleSchema.role]
        }
    }
}
