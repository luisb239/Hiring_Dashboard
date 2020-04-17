'use strict'

module.exports = (db) => {

    return {
        getCandidates: db.getCandidates,
        getCandidateById:(id) => db.getCandidateById(id),
        getCandidateByRequest:(req_id) => db.getCandidateByRequest(req_id),
        postCandidate: (body) => postCandidate(body)
    }

    function postCandidate(body) {
        const values = [body.name, body.available] // If candidate only starts with these 2
        const success = {
            status : 201,
            message : `Candidate created with success`,
        }
        if(body)
            return db.postCandidate(values)
        else 
            return Promise.reject("Request  body missing")
            
    }

}