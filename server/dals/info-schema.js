const infos = require('../schemas/workflow-phases-schemas/info-schema.js')
const phaseInfos = require('../schemas/workflow-phases-schemas/phase-info-schema.js')

module.exports = (query) => {
    return {
        getInfosByPhase
    }

    async function getInfosByPhase({phase}) {
        const statement = {
            name: 'Get Infos By Phase',
            text:
                `SELECT I.* FROM ${infos.table} AS I ` +
                `INNER JOIN ${phaseInfos.table} AS P ` +
                `ON P.${phaseInfos.infoName} = I.${infos.name} ` +
                `WHERE P.${phaseInfos.phase} = $1;`,
            values: [phase]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    function extract(row) {
        return {
            name: row[infos.name],
            value: row[infos.value]
        }
    }
}
