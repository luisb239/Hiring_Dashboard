'use strict'

module.exports = (db) => {

    return {
        getCandidates: db.getCandidates,
        getCandidateById:(id) => db.getCandidateById(id),
        getCandidateByRequest:(req_id) => db.getCandidateByRequest(req_id),
        postCandidate: (body) => postCandidate(body)
    }

    function postCandidate(body) {
            if(body.name)
                if(body.available) {
                    return db.postCandidate(body.name, body.available)
                }
                else 
                    Promise.reject("Candidate field 'available' missing")
            else 
                Promise.reject("Candidate field 'name' missing")
    }

}