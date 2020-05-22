'use strict'

module.exports = (service) => {

    return {getLanguages}

    async function getLanguages(req, res) {
            const languages = await service.getLanguages()
            res.status(200).send(languages)
    }
}
