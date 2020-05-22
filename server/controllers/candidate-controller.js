'use strict'

module.exports = (service) => {

    return {
        getCandidates: getCandidates,
        getCandidateById: getCandidateById,
        postCandidate: postCandidate,
    }

    async function getCandidates(req, res) {
        const candidates = await service.getCandidates({
            available: req.query.available
        })
        res.status(200).send(candidates)
    }

    async function getCandidateById(req, res) {
        const candidate = await service.getCandidateById({
            id: req.params.id
        })
        res.status(200).send(candidate)
    }

    async function postCandidate(req, res) {
        const candidate = await service.createCandidate({
            name: req.body.name,
            cv: req.body.cv,
            available: req.body.available,
            profileInfo: req.body.profile_info
        })
        res.status(201).send(candidate)
    }
}
