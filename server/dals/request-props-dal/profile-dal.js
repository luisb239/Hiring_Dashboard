'use strict'

const schema = require('../../schemas/request-props-schemas/profile-schema.js')
const candidateProfileSchema = require('../../schemas/candidate-profile-schema.js')

module.exports = (query) => {

    return {getProfiles, getCandidateProfiles}

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

    async function getCandidateProfiles({candidateId}) {
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
}
