'use strict'

const AppError = require('../errors/app-error.js')
const errors = require('../errors/common-errors.js')

module.exports = (phaseDb, infoDb) => {

    return {
        getPhase, getPhases
    }

    async function getPhases() {
        const phases = await phaseDb.getPhases()
        return {
            phases: phases
        }
    }

    async function getPhase({phase}) {
        const _phase = await phaseDb.getPhase({phase})

        if (!_phase)
            throw new AppError(errors.notFound, "Phase Not Found", `Phase ${phase} does not exist`)

        const infos = await infoDb.getInfosByPhase({phase})

        return {
            phase: _phase.phase,
            infos: infos.map(info => ({
                name: info.name,
                type: info.value.type
            }))
        }
    }
}
