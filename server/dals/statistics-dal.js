'use strict'

const requestSchema = require('./dal-schemas/request-schema.js')
const userRoleReqSchema = require('./dal-schemas/user-roles-schemas/user-role-request-schema.js')
const userRoleSchema = require('./dal-schemas/user-roles-schemas/user-role-schema.js')
const user = require('./dal-schemas/user-roles-schemas/user-schema.js')
const role = require('./dal-schemas/user-roles-schemas/role-schema.js')
const processSchema = require('./dal-schemas/process/process-schema.js')
const candidateSchema = require('./dal-schemas/candidate-schema')
const currentPhaseSchema = require('./dal-schemas/process/process-current-phase.js')
const reqLanguagesSchema = require('./dal-schemas/request-language-schema')
const statisticsConfigs = require('./dal-schemas/statistics-configs-schema')

module.exports = (query) => {

    return {
        getStatistics, saveConfigs, getConfigs, getConfigsDetails
    }

    async function getStatistics() {
        const statement = {
            name: 'Get All Statistics',
            text:
                `SELECT DISTINCT ` +
                // Request info
                `R.${requestSchema.id}, R.${requestSchema.state}, R.${requestSchema.progress}, ` +
                `R.${requestSchema.dateToSendProfile}, R.${requestSchema.workflow}, R.${requestSchema.profile}, ` +
                `R.${requestSchema.project}, R.${requestSchema.stateCsl}, R.${requestSchema.skill}, ` +
                `R.${requestSchema.targetDate}, R.${requestSchema.description}, R.${requestSchema.quantity}, ` +
                `R.${requestSchema.request_date}, ` +
                // Process info (candidate id + process status)
                `P.${processSchema.candidateId}, P.${processSchema.status}, ` +
                // Candidate info (name)
                `C.${candidateSchema.name}, ` +
                // Process Current Phase info
                `PP.${currentPhaseSchema.currentPhase}, ` +
                // User Role Request info
                `URR.${userRoleReqSchema.userId}, URR.${userRoleReqSchema.roleId}, ` +
                // User email and Role name
                `${user.table}.${user.email}, ${role.table}.${role.role}, ` +
                // Request Languages
                `RL.${reqLanguagesSchema.language}, RL.${reqLanguagesSchema.isMandatory} ` +

                `FROM ${requestSchema.table} AS R ` +

                `LEFT JOIN ${processSchema.table} AS P ` +
                `ON R.${requestSchema.id} = P.${processSchema.requestId} ` +

                `LEFT JOIN ${candidateSchema.table} AS C ` +
                `ON P.${processSchema.candidateId} = C.${candidateSchema.id} ` +

                `LEFT JOIN ${currentPhaseSchema.table} AS PP ` +
                `ON PP.${currentPhaseSchema.candidateId} = P.${processSchema.candidateId} ` +
                `AND PP.${currentPhaseSchema.requestId} = P.${processSchema.requestId} ` +

                `LEFT JOIN ${userRoleReqSchema.table} AS URR ` +
                `ON R.${requestSchema.id} = URR.${userRoleReqSchema.requestId} ` +

                `LEFT JOIN ${userRoleSchema.table} as UserRole ` +
                `ON URR.${userRoleReqSchema.userId} = UserRole.${userRoleSchema.userId} ` +
                `AND URR.${userRoleReqSchema.roleId} = UserRole.${userRoleSchema.roleId} ` +

                `LEFT JOIN ${user.table} ` +
                `ON UserRole.${userRoleSchema.userId} = ${user.table}.${user.id} ` +

                `LEFT JOIN ${role.table} ` +
                `ON UserRole.${userRoleSchema.roleId} = ${role.table}.${role.roleId} ` +

                `LEFT JOIN ${reqLanguagesSchema.table} AS RL ` +
                `ON R.${requestSchema.id} = RL.${reqLanguagesSchema.requestId};`,
            values: []
        }

        const result = await query(statement)
        return result.rows.map(row => extractStatistics(row))
    }

    function extractStatistics(row) {
        return {
            // Process info
            candidateId: row[processSchema.candidateId],
            status: row[processSchema.status],
            // Request info
            requestId: row[requestSchema.id],
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
            dateToSendProfile: row[requestSchema.dateToSendProfile] ?
                new Date(row[requestSchema.dateToSendProfile]).toLocaleDateString() : null,
            progress: row[requestSchema.progress],
            // Candidate info
            candidateName: row[candidateSchema.name],
            // Process Current Phase
            currentPhase: row[currentPhaseSchema.currentPhase],
            // User Role Request
            userId: row[userRoleReqSchema.userId],
            roleId: row[userRoleReqSchema.roleId],
            userEmail: row[user.email],
            role: row[role.role],
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
                `RETURNING ${statisticsConfigs.userId}, ${statisticsConfigs.profileName};`,
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

}
