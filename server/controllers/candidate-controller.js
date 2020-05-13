'use strict'

const errors = require('./errors/errors.js')
const handler = require('./errors/handler.js')

module.exports = (service) => {

    return {
        getCandidates: getCandidates,
        getCandidateById: getCandidateById,
        getCandidatesByRequest: getCandidatesByRequest,
        postCandidate: postCandidate,
        getCandidatesByRequestAndPhase: getCandidatesByRequestAndPhase,
    }

    async function getCandidates(req, res) {
        try {
            const candidates = await service.getCandidates({
                available: req.query.available
            })
            res.status(200).send(candidates)
        } catch (e) {
            handler(res, e, "Unable to retrieve candidates")
            /*
            res.status(400).send({error: 'Invalid Input Syntax'})

             */
        }
    }

    async function getCandidateById(req, res) {
        try {
            const candidate = await service.getCandidateById({
                id: req.params.id
            })
            res.status(200).send(candidate)
        } catch (e) {
            if (e.type === errors.resourceNotFound) {
                res.status(404).send({error: e.message})
            } else {
                //TODO -> SERVICE DEVE TER TRY CATCH E MANDA ESTE ERRO
                res.status(400).send({error: 'Invalid Input Syntax'})
            }
        }
    }

    async function getCandidatesByRequest(req, res) {
        try {
            const candidates = await service.getCandidatesByRequestId({
                requestId: req.params.id,
                available: req.query.available
            })
            res.status(200).send(candidates)
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    async function postCandidate(req, res) {
        try {
            const candidate = await service.createCandidate({
                name: req.body.name,
                cv : req.body.cv,
                available : req.body.available,
                profileInfo : req.body.profile_info
            })
            res.status(201).send(candidate)
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    async function getCandidatesByRequestAndPhase(req, res) {
        try {
            const candidates = await service.getCandidatesByRequestAndPhase({
                request: req.params.requestId,
                phase: req.params.phase,
                inCurrentPhase: req.query.in_current_phase
            })
            res.status(200).send(candidates)
        } catch (e) {
            // TODO
            res.status(500).send({error: 'Errors not handled yet'})
        }
    }



}