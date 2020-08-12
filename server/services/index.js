'use strict'

module.exports = (db, authModule, transporter) => {

    const user = require('./user-service.js')(db.user, db.role, authModule)

    const email = require('./email-service.js')(db.user, transporter)

    const request = require('./request-service.js')(db.request, db.process,
        db.requestLanguage, authModule, db.candidate, email, db.transaction)

    const requestProps = require('./request-props-service.js')(db.language, db.months, db.profile,
        db.project, db.skill, db.state, db.stateCsl, db.workflow, db.phase)

    const candidate = require('./candidate-service.js')(db.candidate, db.profile, db.process)

    const phase = require('./phase-service.js')(db.phase, db.info)

    const process = require('./process-service.js')(db.request, db.candidate,
        db.process, db.phase, db.info, db.processUnavailableReason, db.processPhases,
        db.processInfo, db.reasons, db.status, email)

    const statistics = require('./statistics-service.js')(db.statistics)

    return {
        user, requestProps, request, candidate, phase, process, statistics, email
    }
}
