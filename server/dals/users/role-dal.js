'use strict'

const roleSchema = require('../../schemas/user-roles-schemas/role-schema.js')
const userRoleSchema = require('../../schemas/user-roles-schemas/user-role-schema.js')
const userRoleTypeSchema = require('../../schemas/user-roles-schemas/user-role-type-schema.js')

module.exports = (query) => {

    return {
        getUserRoles: getUserRoles
    }

    async function getUserRoles({userId}) {
        const statement = {
            name: 'Get User Roles And Type',
            text:
                `SELECT * FROM ${roleSchema.table} ` +
                `INNER JOIN ${userRoleSchema.table} AS UR ON ` +
                `${roleSchema.table}.${roleSchema.roleId} = UR.${userRoleSchema.roleId} ` +
                `LEFT JOIN ${userRoleTypeSchema.table} AS URT ON ` +
                `UR.${userRoleSchema.userId} = URT.${userRoleTypeSchema.userId} AND ` +
                `UR.${userRoleSchema.roleId} = URT.${userRoleTypeSchema.roleId} ` +
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
            roleId: row[roleSchema.roleId],
            roleType: row[userRoleTypeSchema.roleType]
        }
    }
}
