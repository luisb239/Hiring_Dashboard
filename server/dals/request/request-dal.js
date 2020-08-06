'use strict'

const requestSchema = require('../../schemas/request-schema.js')
const userRoleReqSchema = require('../../schemas/user-roles-schemas/user-role-request-schema.js')
const userRoleSchema = require('../../schemas/user-roles-schemas/user-role-schema.js')
const user = require('../../schemas/user-roles-schemas/user-schema.js')
const role = require('../../schemas/user-roles-schemas/role-schema.js')

const dateFormat = require('dateformat');

module.exports = (query) => {

    return {
        getRequests, getRequestById, createRequest,
        getUserRolesInRequest, updateRequest, addUserAndRoleToRequest
    }

    async function getRequests({
                                   skill = null, state = null, stateCsl = null,
                                   profile = null, project = null, workflow = null,
                                   minQuantity = null, maxQuantity = null,
                                   minProgress = null, maxProgress = null, targetDate = null,
                                   userId = null
                               }) {
        const statement = {
            name: 'Get Requests',
            text:
                `SELECT DISTINCT R.* FROM ${requestSchema.table} AS R ` +
                `LEFT JOIN ${userRoleReqSchema.table} AS URR ` +
                `ON R.${requestSchema.id} = URR.${userRoleReqSchema.requestId} ` +
                `WHERE ` +
                `(R.${requestSchema.skill} = $1 OR $1 is null) AND ` +
                `(R.${requestSchema.state} = $2 OR $2 is null) AND ` +
                `(R.${requestSchema.stateCsl} = $3 OR $3 is null) AND ` +
                `(R.${requestSchema.profile} = $4 OR $4 is null) AND ` +
                `(R.${requestSchema.project} = $5 OR $5 is null) AND ` +
                `(R.${requestSchema.workflow} = $6 OR $6 is null) AND ` +
                `((R.${requestSchema.quantity} BETWEEN $7 AND $8) OR ($7 is null) OR ($8 is null)) AND ` +
                `((R.${requestSchema.progress} BETWEEN $9 AND $10) OR ($9 is null) OR ($10 is null)) AND ` +
                `(R.${requestSchema.targetDate} = $11 OR $11 is null) AND ` +
                `(URR.${userRoleReqSchema.userId} = $12 OR $12 is null);`,
            values: [
                skill, state, stateCsl, profile,
                project, workflow, minQuantity, maxQuantity,
                minProgress, maxProgress, targetDate, userId
            ]
        }

        const result = await query(statement)
        return result.rows.map(row => extractRequest(row))
    }

    async function getRequestById({id}) {
        const statement = {
            name: 'Get Request By Id',
            text:
                `SELECT * FROM ${requestSchema.table} ` +
                `WHERE ${requestSchema.id} = $1;`,
            values: [id]
        }
        const result = await query(statement)

        if (result.rowCount) {
            return extractRequest(result.rows[0])
        }
        return null
    }

    async function updateRequest({
                                     id, quantity = null, targetDate = null,
                                     state = null, skill = null, stateCsl = null,
                                     project = null, profile = null,
                                     dateToSendProfile = null
                                 }) {
        const statement = {
            name: 'Update Request',
            text:
                `UPDATE ${requestSchema.table} SET ` +
                `${requestSchema.quantity} = COALESCE($1, ${requestSchema.quantity}), ` +
                `${requestSchema.targetDate} = COALESCE($2, ${requestSchema.targetDate}), ` +
                `${requestSchema.state} = COALESCE($3, ${requestSchema.state}), ` +
                `${requestSchema.skill} = COALESCE($4, ${requestSchema.skill}), ` +
                `${requestSchema.stateCsl} = COALESCE($5, ${requestSchema.stateCsl}), ` +
                `${requestSchema.project} = COALESCE($6, ${requestSchema.project}), ` +
                `${requestSchema.profile} = COALESCE($7, ${requestSchema.profile}), ` +
                `${requestSchema.dateToSendProfile} = COALESCE($8, ${requestSchema.dateToSendProfile}) ` +
                `WHERE ${requestSchema.id} = $9;`,
            values: [quantity, targetDate, state, skill, stateCsl,
                project, profile, dateToSendProfile, id]
        }

        await query(statement)
    }

    async function createRequest({
                                     quantity, description, targetDate, state, skill, stateCsl,
                                     project, profile, workflow, dateToSendProfile, requestDate, progress
                                 }) {
        const statement = {
            name: 'Create Request',
            text:
                `INSERT INTO ${requestSchema.table} ` +
                `(${requestSchema.quantity}, ${requestSchema.description}, ` +
                `${requestSchema.targetDate}, ${requestSchema.state}, ` +
                `${requestSchema.skill}, ${requestSchema.stateCsl}, ` +
                `${requestSchema.project}, ${requestSchema.profile}, ` +
                `${requestSchema.workflow}, ${requestSchema.dateToSendProfile}, ` +
                `${requestSchema.request_date}, ${requestSchema.progress}) ` +
                `VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;`,
            values: [quantity, description, targetDate, state, skill,
                stateCsl, project, profile, workflow, dateToSendProfile, requestDate, progress]
        }

        // TODO
        // try catch -> mapear o erro do node pg -> mandar um erro que faça sentido para o alert..
        // log do erro original -> causa do erro

        const result = await query(statement)
        return extractRequest(result.rows[0])
    }


    // TODO -> CREATE USER-ROLE-DAL AND MOVE THIS METHOD
    async function getUserRolesInRequest({requestId}) {
        const statement = {
            name: 'Get User Roles In Request',
            text:
                `SELECT UR.${userRoleSchema.userId}, UR.${userRoleSchema.roleId}, ` +
                `${user.table}.${user.email}, ${role.table}.${role.role} ` +
                `FROM ${userRoleReqSchema.table} AS URR ` +

                `INNER JOIN ${userRoleSchema.table} AS UR ` +
                `ON URR.${userRoleReqSchema.userId} = UR.${userRoleSchema.userId} ` +
                `AND URR.${userRoleReqSchema.roleId} = UR.${userRoleSchema.roleId} ` +

                `INNER JOIN ${user.table} ` +
                `ON UR.${userRoleSchema.userId} = ${user.table}.${user.id} ` +

                `INNER JOIN ${role.table} ` +
                `ON UR.${userRoleSchema.roleId} = ${role.table}.${role.roleId} ` +

                `WHERE URR.${userRoleReqSchema.requestId} = $1;`,
            values: [requestId]
        }

        const result = await query(statement)

        return result.rows.map(row => extractUserRole(row))
    }

    function extractUserRole(row) {
        return {
            userId: row[userRoleSchema.user_Id],
            roleId: row[userRoleSchema.role_Id],
            email: row[user.email],
            role: row[role.role]
        }
    }

    function extractRequest(obj) {
        return {
            id: obj[requestSchema.id],
            quantity: obj[requestSchema.quantity],
            description: obj[requestSchema.description],
            requestDate: dateFormat(new Date(obj[requestSchema.request_date]), "yyyy-mm-dd"),
            targetDate: obj[requestSchema.targetDate],
            state: obj[requestSchema.state],
            skill: obj[requestSchema.skill],
            stateCsl: obj[requestSchema.stateCsl],
            project: obj[requestSchema.project],
            profile: obj[requestSchema.profile],
            workflow: obj[requestSchema.workflow],
            dateToSendProfile: obj[requestSchema.workflow] ?
                dateFormat(new Date(obj[requestSchema.dateToSendProfile]), "yyyy-mm-dd") : null,
            progress: obj[requestSchema.progress]
        }
    }

    async function addUserAndRoleToRequest({userId, roleId, requestId}) {
        const statement = {
            name: 'Add user and role to request',
            text:
                `INSERT INTO ${userRoleReqSchema.table} ` +
                `(${userRoleReqSchema.userId}, ${userRoleReqSchema.roleId}, ${userRoleReqSchema.requestId}) ` +
                `VALUES ($1, $2, $3);`,
            values: [userId, roleId, requestId]
        }

        await query(statement)
        //TODO -> Check if insert was successful
    }
}
