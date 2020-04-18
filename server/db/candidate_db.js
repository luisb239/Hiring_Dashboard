'use strict';

module.exports = (query, entities) => {

    const process = entities.process.table
    const candidate = entities.candidate.table
    const candidate_id = entities.candidate.id
    const candidate_name = entities.candidate.name
    const candidate_available = entities.candidate.available
    const request_id = entities.process.request_id

    return {
        getCandidates: getCandidates,
        getCandidateById: getCandidateById,
        getCandidateByRequest: getCandidateByRequestId,
        postCandidate: postCandidate
    }

    function getCandidates(queryValues) {
        // Had issues passing the whole queryvalues to $1 had to split in 2
        if(queryValues)
            return query(`SELECT * FROM ${candidate} WHERE ${queryValues[0]} = $1;`, [queryValues[1]])
            .then(res => res.rows)
        return query(`SELECT * FROM ${candidate};`)
        .then(res => res.rows)
    }

    function getCandidateById(id) {
        return query(`SELECT * FROM ${candidate} WHERE ${candidate_id} = $1`, [id])
            .then(res => res.rows)
    }

    function getCandidateByRequestId(req_id) {
        const statement = `SELECT ${candidate}.*\
        FROM ${process} INNER JOIN ${candidate}\
        ON ${process}.${candidate_id} = ${candidate}.${candidate_id}\
        WHERE ${request_id} = $1`
        return query(statement, [req_id])
            .then(res => res.rows)
    }

    function postCandidate(name, available) {
        const statement = `INSERT INTO ${candidate}(${candidate_name},${candidate_available})\
        VALUES ($1, $2) RETURNING ${candidate_id};`
        return query(statement, [name, available])
            .then(res => res.rows[0])
    }

}