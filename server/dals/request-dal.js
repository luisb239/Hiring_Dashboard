'use strict'

const requestSchema = require('../schemas/request-schema.js')
const userRoleReqSchema = require('../schemas/user-roles-schemas/user-role-request-schema.js')
const userRoleSchema = require('../schemas/user-roles-schemas/user-role-schema.js')

module.exports = (query) => {

    return {
        getRequests, getRequestById, createRequest,
        getUserRolesInRequest,
    }

    async function getRequests({
                                   skill = null, state = null, stateCsl = null,
                                   profile = null, project = null, workflow = null,
                                   minQuantity = null, maxQuantity = null,
                                   minProgress = null, maxProgress = null,
                                   userId = null, roleId = null
                               }) {
        const statement = {
            name: 'Get Requests',
            text:
                `SELECT R.* FROM ${requestSchema.table} AS R ` +
                `INNER JOIN ${userRoleReqSchema.table} AS URR ` +
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
                `(URR.${userRoleReqSchema.userId} = $11 OR $11 is null) AND ` +
                `(URR.${userRoleReqSchema.roleId} = $12 OR $12 is null);`,
            values: [
                skill, state, stateCsl, profile,
                project, workflow, minQuantity, maxQuantity,
                minProgress, maxProgress, userId, roleId
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

        if(result.rowCount) {
            return result.rows.map(row => extractRequest(row))[0]
        }
        return null
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
                `${requestSchema.target_date}, ${requestSchema.state}, ` +
                `${requestSchema.skill}, ${requestSchema.stateCsl}, ` +
                `${requestSchema.project}, ${requestSchema.profile}, ` +
                `${requestSchema.workflow}, ${requestSchema.dateToSendProfile}, ` +
                `${requestSchema.request_date}, ${requestSchema.progress}) ` +
                `VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;`,
            values: [quantity, description, targetDate, state, skill,
                stateCsl, project, profile, workflow, dateToSendProfile, requestDate, progress]
        }

        // TODO
        // try catch -> mapear o erro do node pg -> mandar um erro que faça sentido para o service..
        // log do erro original -> causa do erro

        const result = await query(statement)
        return result.rows.map(row => extractRequest(row))[0]
    }


    // TODO -> CREATE USER-ROLE-DAL AND MOVE THIS METHOD
    async function getUserRolesInRequest({requestId}) {
        const statement = {
            name: 'Get User Roles In Request',
            text:
                `SELECT URR.${userRoleSchema.userId}, URR.${userRoleSchema.roleId} ` +
                `FROM ${userRoleReqSchema.table} AS URR ` +

                `INNER JOIN ${userRoleSchema.table} AS UR ` +
                `ON URR.${userRoleReqSchema.userId} = UR.${userRoleSchema.userId} ` +
                `AND URR.${userRoleReqSchema.roleId} = UR.${userRoleSchema.roleId} ` +

                `WHERE URR.${userRoleReqSchema.requestId} = $1;`,
            values: [requestId]
        }

        const result = await query(statement)

        return result.rows.map(row => extractUserRole(row))
    }

    function extractUserRole(obj) {
        return {
            userId: obj[userRoleSchema.userId],
            roleId: obj[userRoleSchema.roleId],

        }
    }

    function extractRequest(obj) {
        return {
            id: obj[requestSchema.id],
            quantity: obj[requestSchema.quantity],
            description: obj[requestSchema.description],
            requestDate: new Date(obj[requestSchema.request_date]).toLocaleDateString(),
            targetDate: obj[requestSchema.target_date],
            state: obj[requestSchema.state],
            skill: obj[requestSchema.skill],
            stateCsl: obj[requestSchema.stateCsl],
            project: obj[requestSchema.project],
            profile: obj[requestSchema.profile],
            workflow: obj[requestSchema.workflow],
            dateToSendProfile: new Date(obj[requestSchema.dateToSendProfile]).toLocaleDateString(),
            progress: obj[requestSchema.progress]
        }
    }

}
