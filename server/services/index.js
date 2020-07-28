'use strict'

module.exports = (db, authModule) => {

    const user = require('./user-service.js')(db.user)

    const request = require('./request-service.js')(db.request, db.process,
        db.requestLanguage, authModule, db.candidate)

    const requestProps = require('./request-props-service.js')(db.language, db.months, db.profile,
        db.project, db.skill, db.state, db.stateCsl, db.workflow, db.phase)

    const candidate = require('./candidate-service.js')(db.candidate, db.profile, db.process)

    const phase = require('./phase-service.js')(db.phase, db.info)

    const process = require('./process-service.js')(db.request, db.candidate,
        db.process, db.phase, db.info, db.processUnavailableReason, db.processPhases,
        db.processInfo, db.reasons, db.status)

    const auth = require('./auth-service.js')(db.user, authModule)

    const statistics = require('./statistics-service.js')(db.statistics, authModule)

    return {
        user, requestProps, request, candidate, phase, process, auth, statistics
    }
}
