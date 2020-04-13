'use strict';

const entities = require('./hd_entities.js')();

module.exports = () => {
    // Domain Rules

    // Request Properties
    const state = {value : 'state', redirectTo : entities.request_state};
    const skill = {value : 'skill', redirectTo: entities.request_skill};
    const state_csl = {value : 'state_csl', redirectTo: entities.request_state_csl};
    const project = {value : 'project', redirectTo : entities.request_project};
    const profile = {value : 'profile', redirectTo : entities.request_profile};
    const language = {value : 'language', redirectTo : entities.request_language};
    const workflow = {value : 'workflow', redirectTo : entities.request_workflow};

    const request_properties = [state, skill, state_csl, project, profile, language, workflow];

    function isPropertyValid(property) {
        return request_properties.find(p => p.value === property);
    }

    return {
        isPropertyValid : isPropertyValid,
    }

}