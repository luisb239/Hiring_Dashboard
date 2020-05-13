'use strict'

const reqSchema = require('../schemas/request-schema.js')
const userRoleReqSchema = require('../schemas/userRoleRequestSchema.js')

module.exports = (query) => {

    return {
        getRequests, getRequestById, createRequest, getRequestsByUserAndRole,
    }

    async function getRequests({
                                   skill = null, state = null, stateCsl = null,
                                   profile = null, project = null, workflow = null,
                                   minQuantity = null, maxQuantity = null,
                                   minProgress = null, maxProgress = null}) {
        const statement = {
            name: 'Get Requests',
            text:
                `SELECT * FROM ${reqSchema.table} ` +
                `WHERE ` +
                `(${reqSchema.skill} = $1 OR $1 is null) AND ` +
                `(${reqSchema.state} = $2 OR $2 is null) AND ` +
                `(${reqSchema.stateCsl} = $3 OR $3 is null) AND ` +
                `(${reqSchema.profile} = $4 OR $4 is null) AND ` +
                `(${reqSchema.project} = $5 OR $5 is null) AND ` +
                `(${reqSchema.workflow} = $6 OR $6 is null) AND ` +
                `((${reqSchema.quantity} BETWEEN $7 AND $8) OR ($7 is null) OR ($8 is null)) AND ` +
                `((${reqSchema.progress} BETWEEN $9 AND $10) OR ($9 is null) OR ($10 is null));`,
            values: [skill, state, stateCsl, profile, project, workflow, minQuantity, maxQuantity, minProgress, maxProgress]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    async function getRequestById({id}) {
        const statement = {
            name: 'Get Request By Id',
            text:
                `SELECT * FROM ${reqSchema.table} ` +
                `WHERE ${reqSchema.id} = $1;`,
            values: [id]
        }
        const result = await query(statement)

        if(result.rowCount) {
            return result.rows.map(row => extract(row))[0]
        }
        return null
    }

    async function createRequest({quantity, description, targetDate, state, skill, stateCsl,
                                     project, profile, workflow, dateToSendProfile }) {
        const statement = {
            name: 'Create Request',
            text:
                `INSERT INTO ${reqSchema.table} `+
                `(${reqSchema.quantity}, ${reqSchema.description}, ${reqSchema.target_date}, ${reqSchema.state},` +
                `${reqSchema.skill}, ${reqSchema.stateCsl}, ${reqSchema.project}, ` +
                `${reqSchema.profile}, ${reqSchema.workflow}, ${reqSchema.dateToSendProfile}) ` +
                `VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
            values: [quantity, description, targetDate, state, skill, stateCsl, project, profile, workflow, dateToSendProfile]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))[0]
    }

    async function getRequestsByUserAndRole({userId, roleId}) {
        const statement = {
            name: 'Get Requests By User And Role',
            text:
                `SELECT R.* FROM ${userRoleReqSchema.table} AS URR `+
                `INNER JOIN ${reqSchema.table} AS R ` +
                `ON URR.${userRoleReqSchema.requestId} = R.${reqSchema.id} ` +
                `WHERE URR.${userRoleReqSchema.userId} = $1 AND `+
                `URR.${userRoleReqSchema.roleId} = $2;`,
            values: [userId, roleId]
        };

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    function extract(obj) {
        return {
            id : obj[reqSchema.id],
            quantity: obj[reqSchema.quantity],
            description : obj[reqSchema.description],
            requestDate : obj[reqSchema.request_date],
            targetDate : obj[reqSchema.target_date],
            state : obj[reqSchema.state],
            skill : obj[reqSchema.skill],
            stateCsl : obj[reqSchema.stateCsl],
            project : obj[reqSchema.project],
            profile : obj[reqSchema.profile],
            workflow : obj[reqSchema.workflow],
            dateToSendProfile : obj[reqSchema.dateToSendProfile],
            progress : obj[reqSchema.progress]
        }
    }

}
