'use strict'

const AppError = require('./errors/app-error.js')
const errors = require('./errors/common-errors.js')

module.exports = (phaseDb, infoDb) => {

    return {
        getPhase, getPhases
    }

    async function getPhases() {
        return {
            phases: await phaseDb.getPhases()
        }
    }

    async function getPhase({phase}) {
        const phaseFound = await phaseDb.getPhase({phase})

        if (!phaseFound)
            throw new AppError(errors.notFound,
                "Phase Not Found",
                `Phase ${phase} does not exist`)

        const infos = (await infoDb.getInfosByPhase({phase}))
            .map(info => ({
                name: info.name,
                value: info.value
            }))

        return {
            phase: phaseFound.phase,
            infos: infos
        }
    }
}
