'use strict'

const candidateSchema = require('../schemas/candidateSchema.js')
const processSchema = require('../schemas/processSchema.js')

module.exports = (query) => {

    return {
        getCandidates, getCandidateById, getCandidatesByRequestId, createCandidate
    }

    async function getCandidates({available = null}) {
        const statement = {
            name: 'Get Candidates',
            text:
                `SELECT * FROM ${candidateSchema.table} ` +
                `WHERE (${candidateSchema.available} = $1 OR $1 is null);`,
            values: [available]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    async function getCandidateById({id}) {
        const statement = {
            name: 'Get Candidate By Id',
            text:
                `SELECT * FROM ${candidateSchema.table} ` +
                `WHERE ${candidateSchema.id} = $1;`,
            values: [id]
        }

        const result = await query(statement)

        if (result.rowCount) {
            return result.rows.map(row => extract(row))[0]
        }
        return null
    }

    async function getCandidatesByRequestId({requestId, available = null}) {
        const statement = {
            name: 'Get Candidates By Request Id',
            text:
                `SELECT C.* FROM ${processSchema.table} AS P ` +
                `INNER JOIN ${candidateSchema.table} AS C ` +
                `ON P.${processSchema.candidateId} = C.${candidateSchema.id} ` +
                `WHERE (P.${processSchema.requestId} = $1) AND ` +
                `(C.${candidateSchema.available} = $2 OR $2 is null);`,
            values: [requestId, available]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    async function createCandidate({name, cv = null, available = true, profileInfo = null}) {
        const statement = {
            name: 'Create Candidate',
            text:
                `INSERT INTO ${candidateSchema.table}` +
                `(${candidateSchema.name}, ${candidateSchema.cv}, ` +
                `${candidateSchema.available}, ${candidateSchema.profileInfo}) ` +
                `VALUES ($1, $2, $3, $4) RETURNING *;`,
            values: [name, cv, available, profileInfo]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))[0]
    }

    function extract(obj) {
        return {
            id: obj[candidateSchema.id],
            name: obj[candidateSchema.name],
            cv: obj[candidateSchema.cv],
            available: obj[candidateSchema.available],
            profileInfo: obj[candidateSchema.profileInfo],
        }
    }

}
