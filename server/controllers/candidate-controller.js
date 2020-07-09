'use strict'

module.exports = (service) => {

    return {
        getCandidates: getCandidates,
        getCandidateById: getCandidateById,
        postCandidate: postCandidate,
        updateCandidate: updateCandidate,
        downloadCandidateCv: downloadCandidateCv
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
    }

    async function updateCandidate(req, res) {
        await service.updateCandidate({
            id: req.params.id,
            available: req.body.available
        })
        res.status(200).send({message: 'Candidate updated successfully'})
    }

    async function postCandidate(req, res) {
        // TODO -> Check if user send file
        const fileInfo = req.file
        const candidate = await service.createCandidate({
            name: req.body.name,
            cvFileName: fileInfo.originalname,
            cvMimeType: fileInfo.mimetype,
            cvFileBuffer: fileInfo.buffer
        })
        res.status(201).send({
            id: `${candidate.id}`,
            message: `Candidate added successfully`
        })
    }

    async function downloadCandidateCv(req, res) {
        const cvInfo = await service.getCandidateCv({
            id: req.params.id
        })

        res.setHeader('Content-disposition', 'attachment; filename=' + cvInfo.fileName);
        res.setHeader('Content-type', cvInfo.mimeType);
        //"7bit"
        // TODO -> Save encoding in database also?
        res.status(200).end(cvInfo.cv, "7bit")
        /*
        Send file to response
         */
    }
}
