'use strict'

const user = require('./user-roles-schemas/user-schema.js')
const requests = require('./request-schema.js')
const candidates = require('./candidate-schema.js')
const skill = require('./request-props-schemas/skill-schema.js')
const state = require('./request-props-schemas/state-schema.js')
const stateCsl = require('./request-props-schemas/state-csl-schema.js')
const project = require('./request-props-schemas/project-schema.js')
const profile = require('./request-props-schemas/profile-schema.js')
const workflow = require('./request-props-schemas/workflow-schema.js')
const language = require('./request-props-schemas/language-schema.js')
const months = require('./request-props-schemas/months-schema.js')
const userRoleRequest = require('./user-roles-schemas/user-role-request-schema.js')
const phase = require('./workflow-phases-schemas/phase-schema.js')
const workflowPhase = require('./workflow-phases-schemas/workflow-phase-schema.js')
const role = require('./user-roles-schemas/role-schema.js')
const unavailableReasons = require('./process/process-unavailable-reasons-schema.js')

module.exports = {
    user,
    requests,
    candidates,
    skill,
    state,
    stateCsl,
    project,
    profile,
    workflow,
    language,
    months,
    userRoleRequest,
    phase,
    workflowPhase,
    role,
    unavailableReasons
}
