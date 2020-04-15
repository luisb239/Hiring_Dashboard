'use strict';

const entities = require('./hd_entities.js')();

module.exports = () => {
    // Domain Rules

    // Request Properties
    const state = {value: 'state', redirectTo: entities.request_state};
    const skill = {value: 'skill', redirectTo: entities.request_skill};
    const state_csl = {value: 'state_csl', redirectTo: entities.request_state_csl};
    const project = {value: 'project', redirectTo: entities.request_project};
    const profile = {value: 'profile', redirectTo: entities.request_profile};
    const language = {value: 'language', redirectTo: entities.request_language};
    const workflow = {value: 'workflow', redirectTo: entities.request_workflow};

    const request_properties = [state, skill, state_csl, project, profile, language, workflow];

    /*
    const request_id = {value: 'request_id', redirectTo: entities.request.id}
    const quantity = {value: 'quantity', redirectTo: entities.request.quantity}
    const description = {value: 'description', redirectTo: entities.request.description}
    const request_date = {value: 'request_date', redirectTo: entities.request.request_date}
    const target_date = {value: 'target_date', redirectTo: entities.request.target_date}
    const request_state = {value: 'request_state', redirectTo: entities.request.request_state}
    const request_skill = {value: 'request_skill', redirectTo: entities.request.request_skill}
    const request_state_csl = {value: 'request_state_csl', redirectTo: entities.request.request_state_csl}
    const request_project = {value: 'request_project', redirectTo: entities.request.request_project}
    const request_profile = {value: 'request_profile', redirectTo: entities.request.request_profile}
    const request_workflow = {value: 'request_workflow', redirectTo: entities.request.request_workflow}
    const date_to_send_profile = {value: 'date_to_send_profile', redirectTo: entities.request.date_to_send_profile}
    const progress = {value: 'progress', redirectTo: entities.request.progress}
    
     */
    //
    // const request = [request_id,
    //     quantity,
    //     description,
    //     request_date,
    //     target_date
    //     request_state,
    //     request_
    //     request_
    //     request_
    //     request_
    //     request_
    //     date_to_
    //     progress]

    function isPropertyValid(property) {
        return request_properties.find(p => p.value === property);
    }

    function isRequestQueryValid(property) {
        return entities.request[property]
    }

    return {
        isPropertyValid: isPropertyValid,
        isRequestQueryValid: isRequestQueryValid
    }

}