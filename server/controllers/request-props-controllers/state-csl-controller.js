'use strict'

module.exports = (service) => {

    return {getStatesCsl,}

    async function getStatesCsl(req, res) {
            const statesCsl = await service.getStatesCsl()
            res.status(200).send(statesCsl)
    }
}
