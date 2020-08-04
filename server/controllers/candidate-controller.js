'use strict'

module.exports = (service) => {

    return {
        getCandidates: getCandidates,
        getCandidateById: getCandidateById,
        postCandidate: postCandidate,
        updateCandidate: updateCandidate,
        removeCandidateProfile: removeCandidateProfile,
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
        const fileInfo = req.file
        if (fileInfo) {
            await service.updateCandidate({
                id: req.params.id,
                cvFileName: fileInfo.originalname,
                cvMimeType: fileInfo.mimetype,
                cvFileBuffer: fileInfo.buffer,
                cvEncoding: fileInfo.encoding,
                profileInfo: req.body.profileInfo,
                available: req.body.available,
                profiles: req.body.profiles
            })
        } else {
            await service.updateCandidate({
                id: req.params.id,
                profileInfo: req.body.profileInfo,
                available: req.body.available,
                profiles: req.body.profiles
            })
        }
        res.status(200).send({ message: 'Candidate updated successfully' })
    }

    async function removeCandidateProfile(req, res) {
        const decodedProfile = Buffer.from(req.params.profile, 'base64').toString('binary')
        const success = await service.removeCandidateProfile({
            id: req.params.id,
            profile: decodedProfile
        })
        res.status(200).send(success)
    }

    async function postCandidate(req, res) {
        const fileInfo = req.file
        const candidate = await service.createCandidate({
            name: req.body.name,
            profileInfo: req.body.profileInfo,
            cvFileName: fileInfo.originalname,
            cvMimeType: fileInfo.mimetype,
            cvFileBuffer: fileInfo.buffer,
            cvEncoding: fileInfo.encoding
        })

        if (req.body.profiles) {
            await service.addCandidateProfiles({
                id: candidate.id,
                profiles: JSON.parse(req.body.profiles)
            })
        }

        res.status(201).send({
            id: candidate.id,
            message: `Candidate added successfully`
        })
    }

    async function downloadCandidateCv(req, res) {
        const cvInfo = await service.getCandidateCv({
            id: req.params.id
        })
        res.setHeader('Content-disposition', 'attachment; filename=' + cvInfo.fileName);
        res.setHeader('Content-type', cvInfo.mimeType);
        res.status(200).end(cvInfo.cv, cvInfo.encoding)
    }
}
