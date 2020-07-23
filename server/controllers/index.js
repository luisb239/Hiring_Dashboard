'use strict'

module.exports = (services) => {

    const request = require('./request-controller.js')(services.request)

    const requestProps = require('./request-props-controller.js')(services.requestProps)

    const phase = require('./phase-controller.js')(services.phase)

    const candidate = require('./candidate-controller.js')(services.candidate)

    const process = require('./process-controller.js')(services.process)

    const auth = require('./auth-controller.js')(services.auth)

    const statistics = require('./statistics-controller.js')(services.statistics)

    return {request, candidate, requestProps, phase, process, auth, statistics}
}
