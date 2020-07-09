'use strict'

const requestSchema = require('../schemas/request-schema.js')
const userRoleReqSchema = require('../schemas/user-roles-schemas/user-role-request-schema.js')
const processSchema = require('../schemas/process/process-schema.js')
const candidateSchema = require('../schemas/candidate-schema')
const currentPhaseSchema = require('../schemas/process/process-current-phase.js')
const reqLanguagesSchema = require('../schemas/request-language-schema')

module.exports = (query) => {

    return {
        getStatistics,
    }

    async function getStatistics() {
        const statement = {
            name: 'Get All Statistics',
            text:
                `SELECT DISTINCT P.*, ` +
                // Request info
                `R.${requestSchema.state}, R.${requestSchema.progress}, R.${requestSchema.dateToSendProfile}, ` +
                `R.${requestSchema.workflow}, R.${requestSchema.profile}, R.${requestSchema.project}, ` +
                `R.${requestSchema.stateCsl}, R.${requestSchema.skill}, R.${requestSchema.targetDate}, ` +
                `R.${requestSchema.description}, R.${requestSchema.quantity}, R.${requestSchema.request_date}, ` +
                // Candidate info
                `C.${candidateSchema.name}, ` +
                // Process Current Phase info
                `PP.${currentPhaseSchema.currentPhase}, ` +
                // User Role Request info
                `URR.${userRoleReqSchema.userId}, URR.${userRoleReqSchema.roleId}, ` +
                // Request Languages
                `RL.${reqLanguagesSchema.language}, RL.${reqLanguagesSchema.isMandatory} ` +

                `FROM ${processSchema.table} AS P ` +

                `LEFT JOIN ${requestSchema.table} AS R ` +
                `ON P.${processSchema.requestId} = R.${requestSchema.id} ` +

                `LEFT JOIN ${candidateSchema.table} AS C ` +
                `ON P.${processSchema.candidateId} = C.${candidateSchema.id} ` +

                `LEFT JOIN ${currentPhaseSchema.table} AS PP ` +
                `ON PP.${currentPhaseSchema.candidateId} = P.${candidateSchema.id} ` +
                `AND PP.${currentPhaseSchema.requestId} = R.${requestSchema.id} ` +

                `LEFT JOIN ${userRoleReqSchema.table} AS URR ` +
                `ON P.${processSchema.requestId} = URR.${userRoleReqSchema.requestId} ` +

                `LEFT JOIN ${reqLanguagesSchema.table} AS RL ` +
                `ON P.${processSchema.requestId} = RL.${reqLanguagesSchema.requestId};`,
            values: []
        }

        const result = await query(statement)
        return result.rows.map(row => extractStatistics(row))
    }

    function extractStatistics(row) {
        return {
            // Process info
            requestId: row[processSchema.requestId],
            candidateId: row[processSchema.candidateId],
            status: row[processSchema.status],
            // Request info
            state: row[requestSchema.state],
            quantity: row[requestSchema.quantity],
            description: row[requestSchema.description],
            requestDate: new Date(row[requestSchema.request_date]).toLocaleDateString(),
            targetDate: row[requestSchema.targetDate],
            skill: row[requestSchema.skill],
            stateCsl: row[requestSchema.stateCsl],
            project: row[requestSchema.project],
            profile: row[requestSchema.profile],
            workflow: row[requestSchema.workflow],
            dateToSendProfile: row[requestSchema.workflow] ?
                new Date(row[requestSchema.dateToSendProfile]).toLocaleDateString() : null,
            progress: row[requestSchema.progress],
            // Candidate info
            candidateName: row[candidateSchema.name],
            // Process Current Phase
            currentPhase: row[currentPhaseSchema.currentPhase],
            // User Role Request
            userId: row[userRoleReqSchema.userId],
            roleId: row[userRoleReqSchema.requestId],
            // Request Languages
            language: row[reqLanguagesSchema.language],
            isMandatory: row[reqLanguagesSchema.isMandatory]
        }
    }
}