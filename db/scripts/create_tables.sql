CREATE TABLE user_profile(
user_id INT GENERATED ALWAYS AS IDENTITY,
username VARCHAR UNIQUE NOT NULL,
password_hash VARCHAR NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
last_sign_in TIMESTAMP WITH TIME ZONE NULL DEFAULT NULL,
is_active BOOLEAN NOT NULL DEFAULT TRUE,
PRIMARY KEY (user_id)
);

CREATE TABLE role(
role_id INT GENERATED ALWAYS AS IDENTITY,
role VARCHAR UNIQUE NOT NULL,
PRIMARY KEY (role_id)
);

CREATE TABLE role_type(
role_type_id INT GENERATED ALWAYS AS IDENTITY,
role_type VARCHAR UNIQUE NOT NULL,
PRIMARY KEY (role_type_id)
);

CREATE TABLE user_role(
user_id INT,
role_id INT,
role_type_id INT,
FOREIGN KEY (user_id) REFERENCES user_profile(user_id),
FOREIGN KEY (role_id) REFERENCES role(role_id),
FOREIGN KEY (role_type_id) REFERENCES role_type(role_type_id),
PRIMARY KEY (user_id, role_id)
);

CREATE TABLE request_state(
request_state VARCHAR PRIMARY KEY
);

CREATE TABLE request_skill(
request_skill VARCHAR PRIMARY KEY
);

CREATE TABLE request_state_csl(
request_state_csl VARCHAR PRIMARY KEY
);

CREATE TABLE request_project(
request_project VARCHAR PRIMARY KEY
);

CREATE TABLE request_profile(
request_profile VARCHAR PRIMARY KEY
);

CREATE TABLE request_language(
language VARCHAR PRIMARY KEY
);

CREATE TABLE workflow(
workflow VARCHAR PRIMARY KEY
); 

CREATE TABLE months(
month_name VARCHAR PRIMARY KEY
);

-- checks e defaults passam a ficar na aplicação e nao na db !!

CREATE TABLE request(
request_id INT GENERATED ALWAYS AS IDENTITY,
quantity INT NOT NULL CHECK(quantity > 0),
description VARCHAR NOT NULL,
request_date DATE NOT NULL DEFAULT CURRENT_DATE,
target_date VARCHAR NOT NULL,
request_state VARCHAR NOT NULL,
request_state_update_date DATE NOT NULL,
request_skill VARCHAR NOT NULL,
request_state_csl VARCHAR NOT NULL,
request_project VARCHAR NOT NULL,
request_profile VARCHAR NOT NULL,
workflow VARCHAR NOT NULL,
date_to_send_profile DATE NULL DEFAULT NULL,
progress INT NOT NULL DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
FOREIGN KEY (target_date) REFERENCES months(month_name),
FOREIGN KEY (request_state) REFERENCES request_state(request_state),
FOREIGN KEY (request_skill) REFERENCES request_skill(request_skill),
FOREIGN KEY (request_state_csl) REFERENCES request_state_csl(request_state_csl),
FOREIGN KEY (request_project) REFERENCES request_project(request_project),
FOREIGN KEY (request_profile) REFERENCES request_profile(request_profile),
FOREIGN KEY (workflow) REFERENCES workflow(workflow),
PRIMARY KEY (request_id)
);

CREATE TABLE user_role_request(
user_id INT,
role_id INT,
request_id INT,
FOREIGN KEY (user_id, role_id) REFERENCES user_role(user_id, role_id),
FOREIGN KEY (request_id) REFERENCES request(request_id),	
PRIMARY KEY (user_id, role_id, request_id)
);


CREATE TABLE request_language_requirements(
request_id INT,
language VARCHAR,
mandatory BOOLEAN,
FOREIGN KEY (request_id) REFERENCES request(request_id),	
FOREIGN KEY (language) REFERENCES request_language(language),
PRIMARY KEY (request_id, language)
);

CREATE TABLE phase(
phase VARCHAR PRIMARY KEY
/*phase_attributes JSONB NULL*/
);

-- Outra opção: phase_number DEFAULT NULL, criar trigger(INSTEAD OF INSERT) 
-- que calcula o numero da fase e insere os valores
CREATE TABLE workflow_phase(
workflow VARCHAR,
phase VARCHAR,
phase_number INT NOT NULL check(phase_number > 0),
FOREIGN KEY (workflow) REFERENCES workflow(workflow),
FOREIGN KEY (phase) REFERENCES phase(phase),
PRIMARY KEY (workflow, phase)
);

CREATE TABLE candidate(
candidate_id INT GENERATED ALWAYS AS IDENTITY,	
name VARCHAR NOT NULL,
cv VARCHAR NULL DEFAULT NULL, -- blop
available BOOLEAN NOT NULL DEFAULT TRUE,
profile_info VARCHAR NULL DEFAULT NULL,
PRIMARY KEY (candidate_id)	
);

CREATE TABLE process_status(
status VARCHAR PRIMARY KEY
);

CREATE TABLE process(
request_id INT,
candidate_id INT,
status VARCHAR,
FOREIGN KEY (request_id) REFERENCES request(request_id),
FOREIGN KEY (candidate_id) REFERENCES candidate(candidate_id),
FOREIGN KEY (status) REFERENCES process_status(status),
PRIMARY KEY (request_id, candidate_id)
);

CREATE TABLE unavailable_reason(
reason VARCHAR PRIMARY KEY
);

CREATE TABLE process_unavailable_reason(
request_id INT,
candidate_id INT,
reason VARCHAR,
FOREIGN KEY (request_id, candidate_id) REFERENCES process(request_id, candidate_id),
FOREIGN KEY (reason) REFERENCES unavailable_reason(reason),
PRIMARY KEY (request_id, candidate_id)
);

CREATE TABLE process_phase(
request_id INT,
candidate_id INT,
phase VARCHAR,
start_date DATE NOT NULL DEFAULT CURRENT_DATE,
update_date DATE NULL DEFAULT CURRENT_DATE,
notes VARCHAR NULL DEFAULT NULL,
process_current_phase BOOLEAN DEFAULT TRUE,
FOREIGN KEY (request_id, candidate_id) REFERENCES process(request_id, candidate_id),
FOREIGN KEY (phase) REFERENCES phase(phase),
PRIMARY KEY (request_id, candidate_id, phase)
);

CREATE TABLE dynamic_info(
info_name VARCHAR,
json_info JSONB NOT NULL,
PRIMARY KEY(info_name)
);

CREATE TABLE phase_info(
phase VARCHAR,
info_name VARCHAR,
FOREIGN KEY (phase) REFERENCES phase(phase),
FOREIGN KEY (info_name) REFERENCES dynamic_info(info_name),
PRIMARY KEY (phase, info_name)
);

CREATE TABLE process_info(
request_id INT,
candidate_id INT,
info_name VARCHAR,
info_value JSONB,
FOREIGN KEY (request_id, candidate_id) REFERENCES process(request_id, candidate_id),
FOREIGN KEY (info_name) REFERENCES dynamic_info(info_name),
PRIMARY KEY (request_id, candidate_id, info_name)
);

CREATE TABLE candidate_request_profile(
candidate_id INT,
profile VARCHAR,
FOREIGN KEY (candidate_id) REFERENCES candidate(candidate_id),
FOREIGN KEY (profile) REFERENCES request_profile(request_profile),
PRIMARY KEY (candidate_id, profile)
);
