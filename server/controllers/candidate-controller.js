'use strict'

const handler = require('./handler.js')

module.exports = (service) => {

    return {
        getCandidates: getCandidates,
        getCandidateById: getCandidateById,
        postCandidate: postCandidate,
    }

    async function getCandidates(req, res) {
        try {
            const candidates = await service.getCandidates({
                available: req.query.available
            })
            res.status(200).send(candidates)
        } catch (e) {
            handler(e, res, "Unable to retrieve candidates")
        }
    }

    async function getCandidateById(req, res) {
        try {
            const candidate = await service.getCandidateById({
                id: req.params.id
            })
            res.status(200).send(candidate)
        } catch (e) {
            handler(e, res, "Unable to retrieve candidate by id")
        }
    }

    async function postCandidate(req, res) {
        try {
            const candidate = await service.createCandidate({
                name: req.body.name,
                cv: req.body.cv,
                available: req.body.available,
                profileInfo: req.body.profile_info
            })
            res.status(201).send(candidate)
        } catch (e) {
            handler(e, res, "Unable to create candidate")
        }
    }
}
