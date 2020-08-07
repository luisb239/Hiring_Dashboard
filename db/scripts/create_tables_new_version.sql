/* User Statistics Configs */
CREATE TABLE statistics_configs(
user_id INT,
profile_name TEXT,
configs JSONB NOT NULL,
FOREIGN KEY (user_id) REFERENCES public."User"(id),
PRIMARY KEY (user_id, profile_name)
);

/* Role Type */
CREATE TABLE role_type(
role_type VARCHAR PRIMARY KEY
);

/* "UserRoles" + role_type */
CREATE TABLE user_role_type(
user_id INT,
role_id INT,
role_type VARCHAR,
FOREIGN KEY (user_id, role_id) REFERENCES public."UserRoles"("UserId", "RoleId"),
FOREIGN KEY (role_type) REFERENCES role_type(role_type),
PRIMARY KEY (user_id, role_id)
);

/* Request Properties */

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

/* Request */
CREATE TABLE request(
request_id INT GENERATED ALWAYS AS IDENTITY,
quantity INT NOT NULL,
description VARCHAR NOT NULL,
request_date DATE NOT NULL,
target_date VARCHAR NOT NULL,
request_state VARCHAR NOT NULL,
request_skill VARCHAR NOT NULL,
request_state_csl VARCHAR NOT NULL,
request_project VARCHAR NOT NULL,
request_profile VARCHAR NOT NULL,
workflow VARCHAR NOT NULL,
date_to_send_profile DATE NULL,
progress INT NOT NULL,
FOREIGN KEY (target_date) REFERENCES months(month_name),
FOREIGN KEY (request_state) REFERENCES request_state(request_state),
FOREIGN KEY (request_skill) REFERENCES request_skill(request_skill),
FOREIGN KEY (request_state_csl) REFERENCES request_state_csl(request_state_csl),
FOREIGN KEY (request_project) REFERENCES request_project(request_project),
FOREIGN KEY (request_profile) REFERENCES request_profile(request_profile),
FOREIGN KEY (workflow) REFERENCES workflow(workflow),
PRIMARY KEY (request_id)
);

/* UserRole's Requests */
CREATE TABLE user_role_request(
user_id INT,
role_id INT,
request_id INT,
FOREIGN KEY (user_id, role_id) REFERENCES public."UserRoles"("UserId", "RoleId"),
FOREIGN KEY (request_id) REFERENCES request(request_id),	
PRIMARY KEY (user_id, role_id, request_id)
);

/* Request Languages */
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
);

CREATE TABLE workflow_phase(
workflow VARCHAR,
phase VARCHAR,
phase_number INT NOT NULL /* check(phase_number > 0) */,
FOREIGN KEY (workflow) REFERENCES workflow(workflow),
FOREIGN KEY (phase) REFERENCES phase(phase),
PRIMARY KEY (workflow, phase)
);


CREATE TABLE candidate(
candidate_id INT GENERATED ALWAYS AS IDENTITY,	
name VARCHAR NOT NULL,
available BOOLEAN NOT NULL,
profile_info VARCHAR NULL,
cv BYTEA NULL,
cv_mime_type VARCHAR NULL,
cv_filename VARCHAR NULL,
cv_encoding VARCHAR NULL,
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
start_date DATE NOT NULL,
update_date DATE NULL,
notes VARCHAR NULL,
FOREIGN KEY (request_id, candidate_id) REFERENCES process(request_id, candidate_id),
FOREIGN KEY (phase) REFERENCES phase(phase),
PRIMARY KEY (request_id, candidate_id, phase)
);

CREATE TABLE process_current_phase(
request_id INT,
candidate_id INT,
current_phase VARCHAR,
FOREIGN KEY (request_id, candidate_id) REFERENCES process(request_id, candidate_id),
FOREIGN KEY (current_phase) REFERENCES phase(phase),
PRIMARY KEY (request_id, candidate_id)
);

/* Change table name */
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
