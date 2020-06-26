'use strict'

module.exports = (service) => {

    return {
        getCandidates: getCandidates,
        getCandidateById: getCandidateById,
        postCandidate: postCandidate,
        updateCandidate: updateCandidate
    }

    async function getCandidates(req, res) {
        const profiles = req.query.profiles
        const candidates = await service.getCandidates({
            available: req.query.available,
            profiles: profiles ? profiles.includes(",") ? req.query.profiles.split(',') : [profiles] : null
        })
        res.status(200).send(candidates)
    }

    async function getCandidateById(req, res) {
        const candidate = await service.getCandidateById({
            id: req.params.id
        })
        res.status(200).send(candidate)
        //res.write(candidate.candidate.cv)
        //res.status(200).send(candidate)
        //res.status(200).send(candidate)
    }

    async function updateCandidate(req, res) {
        await service.updateCandidate({
            id: req.params.id,
            available: req.body.available
        })
        res.status(200).send({message: 'Candidate updated successfully'})
    }

    async function postCandidate(req, res) {
        // TODO -> CHECKS MISSING
        const candidateCv = req.files.fileKey
        const candidate = await service.createCandidate({name: req.body.name, file: candidateCv})
        res.status(201).send({
            id: `${candidate.id}`,
            message: `Candidate added successfully`
        })
    }
}
