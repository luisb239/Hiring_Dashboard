'use strict'

const roleSchema = require('../dal-schemas/user-roles-schemas/role-schema.js')
const userRoleSchema = require('../dal-schemas/user-roles-schemas/user-role-schema.js')

module.exports = (query) => {

    return {
        getUserRoles: getUserRoles
    }

    async function getUserRoles({userId}) {
        const statement = {
            name: 'Get User Roles',
            text:
                `SELECT * FROM ${roleSchema.table} ` +
                `INNER JOIN ${userRoleSchema.table} AS UR ON ` +
                `${roleSchema.table}.${roleSchema.roleId} = UR.${userRoleSchema.roleId} ` +
                `WHERE ${userRoleSchema.userId} = $1;`,
            values: [userId]
        }
        const result = await query(statement)
        return result.rows.map(row => extractRole(row))
    }

    function extractRole(row) {
        return {
            role: row[roleSchema.role],
            roleId: row[roleSchema.roleId]
        }
    }
}
