'use strict'

const requestSchema = require('../schemas/request-schema.js')
const userRoleReqSchema = require('../schemas/user-roles-schemas/user-role-request-schema.js')
const processSchema = require('../schemas/process/process-schema.js')
const candidateSchema = require('../schemas/candidate-schema')
const currentPhaseSchema = require('../schemas/process/process-current-phase.js')
const reqLanguagesSchema = require('../schemas/request-language-schema')

const statisticsConfigs = require('../schemas/statistics-configs-schema')

module.exports = (query) => {

    return {
        getStatistics, saveConfigs, getConfigs, getConfigsDetails
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
            roleId: row[userRoleReqSchema.roleId],
            // Request Languages
            language: row[reqLanguagesSchema.language],
            isMandatory: row[reqLanguagesSchema.isMandatory]
        }
    }

    async function getConfigs({ userId }) {
        const statement = {
            name: 'Get User Statistics Configuration',
            text:
                `SELECT * FROM ${statisticsConfigs.table} ` +
                `WHERE ${statisticsConfigs.userId} = $1;`,
            values: [userId]
        }

        const result = await query(statement)
        return result.rows.map(row => extractConfigs(row))
    }

    async function getConfigsDetails({ userId, profileName }) {
        const statement = {
            name: 'Get User Statistics Configuration Details',
            text:
                `SELECT * FROM ${statisticsConfigs.table} ` +
                `WHERE ${statisticsConfigs.userId} = $1 AND ${statisticsConfigs.profileName} = $2;`,
            values: [userId, profileName]
        }

        const result = await query(statement)
        if (result.rowCount) {
            return extractConfigsDetails(result.rows[0])
        }
        return null
    }

    async function saveConfigs({ userId, profileName, configs }) {
        const statement = {
            name: 'Save User Statistics Configuration',
            text:
                `INSERT INTO ${statisticsConfigs.table} ` +
                `(${statisticsConfigs.userId}, ${statisticsConfigs.profileName}, ${statisticsConfigs.configs}) ` +
                `VALUES ($1, $2, $3) ` +
                `RETURNING ${statisticsConfigs.userId}, ${statisticsConfigs.profileName}`,
            values: [userId, profileName, configs]
        }

        const result = await query(statement)
        return extractConfigs(result.rows[0])
    }

    function extractConfigs(row) {
        return {
            userId: row[statisticsConfigs.userId],
            profileName: row[statisticsConfigs.profileName]
        }
    }

    function extractConfigsDetails(row) {
        return {
            userId: row[statisticsConfigs.userId],
            profileName: row[statisticsConfigs.profileName],
            configs: row[statisticsConfigs.configs]
        }
    }

    // async function updateConfigs({ userId, configs }) {
    //     const statement = {
    //         name: 'Update User Statistics Configuration',
    //         text:
    //             `UPDATE ${statisticsConfigs.table} SET ` +
    //             `${statisticsConfigs.configs} = $1` +
    //             `WHERE ${statisticsConfigs.userId} = $2; `,
    //         values: [configs, userId]
    //     }
    //     await query(statement)
    // }


}
