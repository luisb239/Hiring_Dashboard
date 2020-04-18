'use strict';

const root = 'candidates';
const requests = 'requests'

module.exports = (service, router) => {

    router.get(`/${root}`, getCandidates)
    router.get(`/${root}/:id`, getCandidateById)
    router.post(`/${root}`, postCandidate)

    router.get(`/${requests}/:request_id/${root}`, getCandidateByRequest)

    function getCandidates(req, res) {
        service.getCandidates(req.query)
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({error: error}))
    }

    function getCandidateById(req, res) {
        service.getCandidateById(req.params.id)
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({error : error}))
    }

    function getCandidateByRequest(req, res) {
        service.getCandidateByRequest(req.params.request_id)
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({error : error}))
    }

    function postCandidate(req, res) {
        function success (id) {
            return {
                status: 201,
                message: "Candidate created with success",
                path: `/hd/candidates/${id}`
            }
        }

        service.postCandidate(req.body)
            .then(result => res.status(201).send(success(result.candidate_id)))
            .catch(error => res.status(400).send({error : error}))
    }

}