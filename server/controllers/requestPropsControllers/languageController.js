'use strict'

module.exports = (service) => {

    return {getLanguages}

    async function getLanguages(req, res) {
        try {
            const languages = await service.getLanguages()
            res.status(200).send(languages)
        }
        catch (e) {
            res.status(500).send({error : "Unexpected Error"})
        }
    }
}
