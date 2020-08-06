'use strict'

const roleSchema = require('../../schemas/user-roles-schemas/role-schema.js')
const userRoleSchema = require('../../schemas/user-roles-schemas/user-role-schema')

module.exports = (query) => {

    return {
        getUserRoles: getUserRoles
    }

    async function getUserRoles({ userId }) {
        const statement = {
            name: 'Get User Roles',
            text:
                `SELECT * FROM ${roleSchema.table} ` +
                `INNER JOIN ${userRoleSchema.table} ON ` +
                `${roleSchema.table}.${roleSchema.roleId} = ` +
                `${userRoleSchema.table}.${userRoleSchema.roleId} ` +
                `WHERE ${userRoleSchema.userId} = $1;`,
            values: [userId]
        }
        const result = await query(statement)
        return result.rows.map(row => extractRole(row))
    }

    function extractRole(row) {
        return {
            role: row[roleSchema.role],
            // roleType: row[roleSchema.],
            roleId: row[roleSchema.roleId]
        }
    }
}
