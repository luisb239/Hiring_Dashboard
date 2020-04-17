'use strict';

const root = 'candidates';
const requests = 'requests'

module.exports = (service, router) => {

    router.get(`/${root}`, getCandidates)
    router.get(`/${root}/:id`, getCandidateById)
    router.get(`/${requests}/:req_id/${root}`, getCandidateByRequest)
    router.post(`/${root}`, postCandidate)

    function getCandidates(req, res) {
        service.getCandidates()
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({error : error}))
    }
    
    function getCandidateById(req, res) {
        const reqPath = req.url.split('/').slice(1)
        const id = reqPath[1]
        service.getCandidateById(id)
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({error : error}))
    }

    function getCandidateByRequest(req, res) {
        const reqPath = req.url.split('/').slice(1)
        const req_id = reqPath[1]
        service.getCandidateByRequest(req_id)
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({error : error}))
    }

    function postCandidate(req, res) {
        const success = {
            status : 201,
            message : `Candidate created with success`,
        }
        service.postCandidate(req.body)
            .then(result => res.status(200).send(success))
            .catch(error => res.status(400).send({error : error}))
    }

}