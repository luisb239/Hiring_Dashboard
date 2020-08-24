'use strict'

const candidate = require('./dal-schemas/candidate-schema.js')
const process = require('./dal-schemas/process/process-schema.js')
const candidateProfiles = require('./dal-schemas/candidate-profile-schema.js')

module.exports = (query) => {

    return {
        getCandidates,
        getCandidateById,
        getCandidatesByRequestId,
        createCandidate: createCandidate,
        updateCandidate: updateCandidate,
        getCandidateCvInfo
    }

    async function getCandidates({ available = null, profiles = null }) {
        const statement = {
            name: 'Get Candidates',
            text:
                `SELECT DISTINCT C.* FROM ${candidate.table} AS C ` +
                `LEFT JOIN ${candidateProfiles.table} AS CP ` +
                `ON C.${candidate.id} = CP.${candidateProfiles.candidateId} ` +
                `WHERE (C.${candidate.available} = $1 OR $1 is null) AND ` +
                `(CP.${candidateProfiles.profile} = ANY($2) OR $2 is null);`,
            values: [available, profiles]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    async function getCandidateById({ id, client }) {
        const statement = {
            name: 'Get Candidate By Id',
            text:
                `SELECT * FROM ${candidate.table} ` +
                `WHERE ${candidate.id} = $1;`,
            values: [id]
        }

        const result = await query(statement, client)

        if (result.rowCount) {
            return extract(result.rows[0])
        }
        return null
    }

    async function getCandidatesByRequestId({ requestId }) {
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

    async function createCandidate({
                                       name, available = true, profileInfo = null,
                                       cvBuffer, cvMimeType, cvFileName, cvEncoding, cvVersionId, timestamp = new Date()
                                   }) {
        const statement = {
            name: 'Create Candidate',
            text:
                `INSERT INTO ${candidate.table} ` +
                `(${candidate.name}, ${candidate.cv}, ${candidate.cvMimeType}, ${candidate.cvFileName}, ` +
                `${candidate.cvEncoding}, ${candidate.available}, ${candidate.profileInfo}, ${candidate.timestamp}) ` +
                `VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ` +
                `RETURNING ${candidate.id};`,
            values: [name, cvBuffer, cvMimeType, cvFileName, cvEncoding, available, profileInfo, timestamp]
        }

        const result = await query(statement)
        return extract(result.rows[0])
    }


    async function updateCandidate({
                                       id, cvFileName, cvMimeType, cvBuffer,
                                       cvEncoding, cvVersionId, profileInfo, available, timestamp, client, newTimestamp = new Date()
                                   }) {
        const statement = {
            name: 'Update Candidate',
            text:
                `UPDATE ${candidate.table} SET ` +
                `${candidate.cv} = COALESCE($1, ${candidate.cv}), ` +
                `${candidate.cvFileName} = COALESCE($2, ${candidate.cvFileName}), ` +
                `${candidate.cvMimeType} = COALESCE($3, ${candidate.cvMimeType}), ` +
                `${candidate.cvEncoding} = COALESCE($4, ${candidate.cvEncoding}), ` +
                `${candidate.cvVersionId} = COALESCE($5, ${candidate.cvVersionId}), ` +
                `${candidate.profileInfo} = COALESCE($6, ${candidate.profileInfo}), ` +
                `${candidate.available} = COALESCE($7, ${candidate.available}), ` +
                `${candidate.timestamp} = $10 ` +
                `WHERE ${candidate.id} = $8 AND ${candidate.timestamp} < $9;`,
            values: [cvBuffer, cvFileName, cvMimeType, cvEncoding, cvVersionId, profileInfo, available,
                id, timestamp, newTimestamp]
        }

        const res = await query(statement, client)
        return res.rowCount
    }

    async function getCandidateCvInfo({ id }) {
        const statement = {
            name: 'Get Candidate Cv Info',
            text:
                `SELECT ${candidate.cv}, ${candidate.cvFileName}, ${candidate.cvMimeType} ` +
                `FROM ${candidate.table} WHERE ${candidate.id} = $1;`,
            values: [id]
        }

        const result = await query(statement)

        if (result.rowCount) {
            return extractCvInfo(result.rows[0])
        }
        return null
    }

    function extract(obj) {
        return {
            id: obj[candidate.id],
            name: obj[candidate.name],
            available: obj[candidate.available],
            profileInfo: obj[candidate.profileInfo],
            cvFileName: obj[candidate.cvFileName],
            cvVersionId: obj[candidate.cvVersionId]
        }
    }

    function extractCvInfo(row) {
        return {
            cvBuffer: row[candidate.cv],
            cvFileName: row[candidate.cvFileName],
            cvMimeType: row[candidate.cvMimeType],
            cvEncoding: row[candidate.cvEncoding],
            cvVersionId: row[candidate.cvVersionId]
        }

    }

}
