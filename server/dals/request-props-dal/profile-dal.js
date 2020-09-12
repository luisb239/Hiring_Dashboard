'use strict'

const schema = require('../dal-schemas/request-props-schemas/profile-schema.js')
const candidateProfileSchema = require('../dal-schemas/candidate-profile-schema.js')

module.exports = (query) => {

    return {
        getProfiles: getProfiles,
        getCandidateProfiles: getCandidateProfiles,
        addProfileToCandidate: addProfileToCandidate,
        deleteProfileFromCandidate: deleteProfileFromCandidate
    }

    async function getProfiles() {
        const statement = {
            name: 'Get Profiles',
            text:
                `SELECT * FROM ${schema.table};`,
            values: []
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    async function getCandidateProfiles({ candidateId }) {
        const statement = {
            name: 'Get Candidate Profiles',
            text:
                `SELECT P.* FROM ${schema.table} AS P ` +
                `INNER JOIN ${candidateProfileSchema.table} AS CP ` +
                `ON P.${schema.profile} = CP.${candidateProfileSchema.profile} ` +
                `WHERE CP.${candidateProfileSchema.candidateId} = $1;`,
            values: [candidateId]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    function extract(obj) {
        return {
            profile: obj[schema.profile]
        }
    }

    async function addProfileToCandidate({candidateId, profile}) {
        const statement = {
            name: 'Add Profile To Candidate',
            text:
                `INSERT INTO ${candidateProfileSchema.table} ` +
                `(${candidateProfileSchema.candidateId}, ${candidateProfileSchema.profile}) ` +
                `VALUES ($1, $2) RETURNING *; `,
            values: [candidateId, profile]
        }

        const res = await query(statement)
        return extract(res.rows[0])
    }

    async function deleteProfileFromCandidate({ candidateId, profile }) {
        const statement = {
            name: 'Delete Profile From Candidate',
            text:
                `DELETE FROM ${candidateProfileSchema.table} ` +
                `WHERE ${candidateProfileSchema.candidateId} = $1 AND ` +
                `${candidateProfileSchema.profile} = $2 RETURNING ` +
                `${candidateProfileSchema.candidateId}, ${candidateProfileSchema.profile};`,
            values: [candidateId, profile]
        }
        const res = await query(statement)
        return res.rowCount
    }
}
