'use strict'

const querystring = require('querystring');

module.exports = (db) => {

    return {
        getCandidates: getCandidates,
        getCandidateById: getCandidateById,
        getCandidateByRequest: getCandidateByRequest,
        postCandidate: postCandidate
    }

    function getCandidates(query) {
        const queryValues = querystring.stringify(query).split('=')
        return db.getCandidates(queryValues)
    }

    function getCandidateById(candidate_id) {
        if (!candidate_id) return Promise.reject("Candidate Id missing")

        return db.getCandidateById(candidate_id)
    }

    function getCandidateByRequest(request_id) {
        if (!request_id) return Promise.reject("Request Id missing")

        return db.getCandidateByRequest(request_id)
    }

    function postCandidate(candidate_name, candidate_availability) {
        if (!candidate_name)
            return Promise.reject("Candidate name not valid")
        if (!candidate_availability)
            return Promise.reject("Candidate availability not valid")

        return db.postCandidate(candidate_name, candidate_availability)
    }

}