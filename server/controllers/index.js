'use strict'

module.exports = (service) => {

    const request = require('./request-controller.js')(service.request)

    const requestProps = require('./request-props-controller.js')(service.requestProps)

    const phase = require('./phase-controller.js')(service.phase)

    const candidate = require('./candidate-controller.js')(service.candidate)

    const process = require('./process-controller.js')(service.process)

    const auth = require('./auth-controller.js')(service.auth)

    return {request, candidate, requestProps, phase, process, auth}
}
