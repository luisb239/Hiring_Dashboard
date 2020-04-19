'use strict';

//hd_entities -> domain or db ??

module.exports = () => {

    const user = {
        table: "user_profile",
        user_id: "user_id",
        username: "username",
        password_hash: "password_hash",
        created_at: "created_at",
        last_sign_in: "last_sign_in",
        is_active: "is_active"
    }

    const request = {
        table: "request",
        id: "request_id",
        quantity: 'quantity',
        description: 'description',
        request_date: 'request_date',
        target_date: 'target_date',
        request_state: 'request_state',
        request_skill: 'request_skill',
        request_state_csl: 'request_state-csl',
        request_project: 'request_project',
        request_profile: 'request_profile',
        request_workflow: 'request_workflow',
        date_to_send_profile: 'date_to_send_profile',
        progress: 'request_state-csl'
    }

    const candidate = {
        table: "candidate",
        id: "candidate_id",
        name: "name",
        cv: "cv",
        available: "available",
        profile_info: "profile_info" 
    }

    const process = {
        table: "process",
        request_id: "request_id",
        candidate_id: "candidate_id",
        status: "status"
    }
    //...
    const role = 'role';
    const role_type = 'role_type';
    const user_role = 'user_role';

    /*
    const request_state = 'request_state';
    const request_skill = 'request_skill';
    const request_state_csl = 'request_state_csl';
    const request_project = 'request_project';
    const request_profile = 'request_profile';
    const request_language = 'request_language';
    const request_workflow = 'workflow';
     */


    //Parece inútil visto que tanto nome da tabela como a sua chave são iguais, mas caso fossem diferentes,
    // ou sofressem alterações no futuro já se poderia tirar partido deste estilo

    const request_state = {
        table: 'request_state',
        key: 'request_state',
        state: 'request_state'
    };

    const request_skill = {
        table: 'request_skill',
        key: 'request_skill',
        skill: 'request_skill'
    };

    const request_state_csl = {
        table: 'request_state_csl',
        key: 'request_state_csl',
        state_csl: 'request_state_csl'
    };

    const request_project = {
        table: 'request_project',
        key: 'request_project',
        project: 'request_project'
    };

    const request_profile = {
        table: 'request_profile',
        key: 'request_profile',
        profile: 'request_profile'
    };

    const request_language = {
        table: 'request_language',
        key: 'language',
        language: 'language'
    };

    const request_workflow = {
        table: 'workflow',
        key: 'workflow',
        name: 'workflow'
    }


    //other tables.. and their attributes

    return {
        user : user,
        request : request,
        candidate : candidate,
        process: process,
        role: role,
        role_type: role_type,
        user_role: user_role,
        //...
        request_state: request_state,
        request_skill: request_skill,
        request_state_csl: request_state_csl,
        request_project: request_project,
        request_profile: request_profile,
        request_language: request_language,
        request_workflow: request_workflow,
    }

}