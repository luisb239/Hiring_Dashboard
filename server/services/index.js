'use strict'

module.exports = (db, authModule) => {

    const request = require('./request-service.js')(db.request, db.candidate, db.user, db.role, db.requestLanguage)

    const requestProps = require('./request-props-service.js')(db.language, db.months, db.profile,
        db.project, db.skill, db.state, db.stateCsl, db.workflow, db.phase)

    const candidate = require('./candidate-service.js')(db.candidate, db.profile)

    const phase = require('./phase-service.js')(db.phase, db.info)

    const process = require('./process-service.js')(db.request, db.candidate, db.process, db.phase, db.info)

    const auth = require('./auth-service.js')(db.user, authModule)

    return {
        requestProps, request, candidate, phase, process, auth
    }
}
