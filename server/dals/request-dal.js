'use strict'

const requestSchema = require('../schemas/request-schema.js')
const userRoleReqSchema = require('../schemas/user-roles-schemas/user-role-request-schema.js')
const userRoleSchema = require('../schemas/user-roles-schemas/user-role-schema.js')
const userSchema = require('../schemas/user-roles-schemas/user-schema.js')
const candidateSchema = require('../schemas/candidate-schema.js');
const processSchema = require('../schemas/process/process-schema.js')

module.exports = (query) => {

    return {
        getRequests, getRequestById, createRequest, getRequestsByUserAndRole,
        getUserRolesInRequest,
    }

    async function getRequests({
                                   skill = null, state = null, stateCsl = null,
                                   profile = null, project = null, workflow = null,
                                   minQuantity = null, maxQuantity = null,
                                   minProgress = null, maxProgress = null}) {
        const statement = {
            name: 'Get Requests',
            text:
                `SELECT * FROM ${requestSchema.table} ` +
                `WHERE ` +
                `(${requestSchema.skill} = $1 OR $1 is null) AND ` +
                `(${requestSchema.state} = $2 OR $2 is null) AND ` +
                `(${requestSchema.stateCsl} = $3 OR $3 is null) AND ` +
                `(${requestSchema.profile} = $4 OR $4 is null) AND ` +
                `(${requestSchema.project} = $5 OR $5 is null) AND ` +
                `(${requestSchema.workflow} = $6 OR $6 is null) AND ` +
                `((${requestSchema.quantity} BETWEEN $7 AND $8) OR ($7 is null) OR ($8 is null)) AND ` +
                `((${requestSchema.progress} BETWEEN $9 AND $10) OR ($9 is null) OR ($10 is null));`,
            values: [skill, state, stateCsl, profile, project, workflow, minQuantity, maxQuantity, minProgress, maxProgress]
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

        const result = await query(statement)
        return result.rows.map(row => extractRequest(row))[0]
    }

    // TODO -> CREATE USER-ROLE-DAL AND MOVE THIS METHOD
    async function getUserRolesInRequest({requestId}) {
        const statement = {
            name: 'Get User Roles In Request',
            text:
                `SELECT ${userSchema.table}.${userSchema.id}, ${userSchema.table}.${userSchema.username}, URR.${userRoleSchema.role} ` +
                `FROM ${userRoleReqSchema.table} AS URR ` +

                `INNER JOIN ${userRoleSchema.table} AS UR ` +
                `ON URR.${userRoleReqSchema.userId} = UR.${userRoleSchema.userId} ` +
                `AND URR.${userRoleReqSchema.role} = UR.${userRoleSchema.role} ` +

                `INNER JOIN ${userSchema.table} ` +
                `ON UR.${userRoleSchema.userId} = ${userSchema.table}.${userSchema.id} ` +

                `WHERE URR.${userRoleReqSchema.requestId} = $1;`,
            values: [requestId]
        }

        const result = await query(statement)

        return result.rows.map(row => extractUserRole(row))
    }

    function extractUserRole(obj) {
        return {
            id: obj[userSchema.id],
            username: obj[userSchema.username],
            role: obj[userRoleSchema.role]
        }
    }

    async function getRequestsByUserAndRole({userId, role}) {
        const statement = {
            name: 'Get Requests By User And Role',
            text:
                `SELECT R.* FROM ${userRoleReqSchema.table} AS URR ` +
                `INNER JOIN ${requestSchema.table} AS R ` +
                `ON URR.${userRoleReqSchema.requestId} = R.${requestSchema.id} ` +
                `WHERE URR.${userRoleReqSchema.userId} = $1 AND ` +
                `URR.${userRoleReqSchema.role} = $2;`,
            values: [userId, role]
        };

        const result = await query(statement)
        return result.rows.map(row => extractRequest(row))
    }

    function extractRequest(obj) {
        return {
            id: obj[requestSchema.id],
            quantity: obj[requestSchema.quantity],
            description: obj[requestSchema.description],
            requestDate: obj[requestSchema.request_date],
            targetDate: obj[requestSchema.target_date],
            state: obj[requestSchema.state],
            skill: obj[requestSchema.skill],
            stateCsl: obj[requestSchema.stateCsl],
            project: obj[requestSchema.project],
            profile: obj[requestSchema.profile],
            workflow: obj[requestSchema.workflow],
            dateToSendProfile: obj[requestSchema.dateToSendProfile],
            progress: obj[requestSchema.progress]
        }
    }

}
