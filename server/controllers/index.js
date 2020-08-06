'use strict'

module.exports = (services) => {

    const user = require('./user-controller.js')(services.user)

    const request = require('./request-controller.js')(services.request, services.email)

    const requestProps = require('./request-props-controller.js')(services.requestProps)

    const phase = require('./phase-controller.js')(services.phase)

    const candidate = require('./candidate-controller.js')(services.candidate)

    const process = require('./process-controller.js')(services.process, services.email)

    const auth = require('./auth-controller.js')(services.user)

    const statistics = require('./statistics-controller.js')(services.statistics)

    return { user, request, candidate, requestProps, phase, process, auth, statistics }
}
