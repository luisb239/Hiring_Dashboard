'use strict'

const candidate = require('../schemas/candidate-schema.js')
const process = require('../schemas/process/process-schema.js')
const processPhase = require('../schemas/process/process-phase-schema.js')

module.exports = (query) => {

    return {
        getCandidates,
        getCandidateById,
        getCandidatesByRequestId,
        createCandidate,
    }

    async function getCandidates({available = null}) {
        const statement = {
            name: 'Get Candidates',
            text:
                `SELECT * FROM ${candidate.table} ` +
                `WHERE (${candidate.available} = $1 OR $1 is null);`,
            values: [available]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    async function getCandidateById({id}) {
        const statement = {
            name: 'Get Candidate By Id',
            text:
                `SELECT * FROM ${candidate.table} ` +
                `WHERE ${candidate.id} = $1;`,
            values: [id]
        }

        const result = await query(statement)

        if (result.rowCount) {
            return result.rows.map(row => extract(row))[0]
        }
        return null
    }

    async function getCandidatesByRequestId({requestId}) {
        const statement = {
            name: 'Get Candidates By Request Id',
            text:
                `SELECT C.* FROM ${process.table} AS P ` +
                `INNER JOIN ${candidate.table} AS C ` +
                `ON P.${process.candidateId} = C.${candidate.id} ` +
                `WHERE (P.${process.requestId} = $1);`,
            values: [requestId]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    async function createCandidate({name, cv = null, available = true, profileInfo = null}) {
        const statement = {
            name: 'Create Candidate',
            text:
                `INSERT INTO ${candidate.table}` +
                `(${candidate.name}, ${candidate.cv}, ` +
                `${candidate.available}, ${candidate.profileInfo}) ` +
                `VALUES ($1, $2, $3, $4) RETURNING *;`,
            values: [name, cv, available, profileInfo]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))[0]
    }

    // TODO -> MOVE to different module instead of Candidate -> ProcessPhase
    async function getCandidatesByRequestAndPhase({request, phase, inCurrentPhase = null}) {
        const statement = {
            name: 'Get Candidates By Request And Phase',
            text:
                `SELECT C.* FROM ${processPhase.table} AS PP ` +
                `INNER JOIN ${candidate.table} AS C ` +
                `ON PP.${processPhase.candidateId} = C.${candidate.id} ` +
                `WHERE PP.${processPhase.requestId} = $1 ` +
                `AND PP.${processPhase.phase} = $2 ` +
                `AND ( PP.${processPhase.isCurrentPhase} = $3 OR $3 is null );`,
            values: [request, phase, inCurrentPhase]
        }
        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    function extract(obj) {
        return {
            id: obj[candidate.id],
            name: obj[candidate.name],
            cv: obj[candidate.cv],
            available: obj[candidate.available],
            profileInfo: obj[candidate.profileInfo],
        }
    }

}
