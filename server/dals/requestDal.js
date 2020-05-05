'use strict'

const schema = require('../schemas/requestSchema.js')

module.exports = (query) => {

    return {
        getRequests, getRequestById, createRequest
    }

    async function getRequests({
                                   skill = null, state = null, stateCsl = null,
                                   profile = null, project = null, workflow = null,
                                   minQuantity = null, maxQuantity = null,
                                   minProgress = null, maxProgress = null}) {
        const statement = {
            name: 'Get Requests',
            text:
                `SELECT * FROM ${schema.table} ` +
                `WHERE ` +
                `(${schema.skill} = $1 OR $1 is null) AND ` +
                `(${schema.state} = $2 OR $2 is null) AND ` +
                `(${schema.stateCsl} = $3 OR $3 is null) AND ` +
                `(${schema.profile} = $4 OR $4 is null) AND ` +
                `(${schema.project} = $5 OR $5 is null) AND ` +
                `(${schema.workflow} = $6 OR $6 is null) AND ` +
                `((${schema.quantity} BETWEEN $7 AND $8) OR ($7 is null) OR ($8 is null)) AND ` +
                `((${schema.progress} BETWEEN $9 AND $10) OR ($9 is null) OR ($10 is null));`,
            values: [skill, state, stateCsl, profile, project, workflow, minQuantity, maxQuantity, minProgress, maxProgress]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    async function getRequestById({id}) {
        const statement = {
            name: 'Get Request By Id',
            text:
                `SELECT * FROM ${schema.table} ` +
                `WHERE ${schema.id} = $1;`,
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
                `INSERT INTO ${schema.table} `+
                `(${schema.quantity}, ${schema.description}, ${schema.target_date}, ${schema.state},` +
                `${schema.skill}, ${schema.stateCsl}, ${schema.project}, ` +
                `${schema.profile}, ${schema.workflow}, ${schema.dateToSendProfile}) ` +
                `VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
            values: [quantity, description, targetDate, state, skill, stateCsl, project, profile, workflow, dateToSendProfile]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))[0]
    }

    function extract(obj) {
        return {
            id : obj[schema.id],
            quantity: obj[schema.quantity],
            description : obj[schema.description],
            requestDate : obj[schema.request_date],
            targetDate : obj[schema.target_date],
            state : obj[schema.state],
            skill : obj[schema.skill],
            stateCsl : obj[schema.stateCsl],
            project : obj[schema.project],
            profile : obj[schema.profile],
            workflow : obj[schema.workflow],
            dateToSendProfile : obj[schema.dateToSendProfile],
            progress : obj[schema.progress]
        }
    }

}
