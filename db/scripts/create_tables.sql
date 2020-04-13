-- Por cada tabela que seja preciso guardar histórico será
-- criada uma nova tabela, com as mesmas colunas mas sem chaves,
-- que irá guardar o histórico de inserts/updates/deletes bem como
-- o user responsável pelas alterações e a data de alteração.
--
-- Ou outra forma que respeita a 3ª forma normal.
--
-- Decidir que tabelas guardar histórico!
--
-- ON DELETE/UPDATE CASCADE, triggers(histórico, Request.progress)?
--	

CREATE TABLE user_profile(
user_id INT GENERATED ALWAYS AS IDENTITY,
username VARCHAR UNIQUE NOT NULL,
password_hash VARCHAR NOT NULL,
last_sign_in DATE NULL DEFAULT NULL,
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
workflow_name VARCHAR PRIMARY KEY
); 

CREATE TYPE month_enum AS ENUM
('January', 
 'February',
 'March', 
 'April',
 'May',
 'June',
 'July',
 'August',
 'September',
 'October',
 'November',
 'December'
);

CREATE TABLE request(
request_id INT GENERATED ALWAYS AS IDENTITY,
quantity INT NOT NULL CHECK(quantity > 0),
description VARCHAR NOT NULL,
request_date DATE NOT NULL DEFAULT CURRENT_DATE,
target_date month_enum NOT NULL, -- mês -> enumerado
request_state VARCHAR,
request_skill VARCHAR,
request_state_csl VARCHAR,
request_project VARCHAR,
request_profile VARCHAR,
request_workflow VARCHAR,
date_to_send_profile DATE NULL DEFAULT NULL,
progress INT NOT NULL DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
FOREIGN KEY (request_state) REFERENCES request_state(request_state),
FOREIGN KEY (request_skill) REFERENCES request_skill(request_skill),
FOREIGN KEY (request_state_csl) REFERENCES request_state_csl(request_state_csl),
FOREIGN KEY (request_project) REFERENCES request_project(request_project),
FOREIGN KEY (request_profile) REFERENCES request_profile(request_profile),
FOREIGN KEY (request_workflow) REFERENCES workflow(workflow_name),
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
yes_valued BOOLEAN,
FOREIGN KEY (request_id) REFERENCES request(request_id),	
FOREIGN KEY (language) REFERENCES request_language(language),
PRIMARY KEY (request_id, language)
);

CREATE TABLE phase(
phase_id INT GENERATED ALWAYS AS IDENTITY,
phase VARCHAR UNIQUE NOT NULL,
PRIMARY KEY (phase_id)
);

CREATE TABLE workflow_phase(
workflow VARCHAR,
phase_id INT,
phase_number INT NOT NULL check(phase_number > 0),
FOREIGN KEY (workflow) REFERENCES workflow(workflow_name),
FOREIGN KEY (phase_id) REFERENCES phase(phase_id),
PRIMARY KEY (workflow, phase_id)
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
score INT NULL DEFAULT NULL,
interview_details VARCHAR NULL DEFAULT NULL,
relevant_remarks VARCHAR NULL DEFAULT NULL,
seniority VARCHAR NULL DEFAULT NULL,
started BOOLEAN DEFAULT FALSE,
starting_date DATE NULL DEFAULT NULL,
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

CREATE TABLE process_workflow_phase(
request_id INT,
candidate_id INT,
workflow VARCHAR,
phase_id INT,
phase_date DATE NOT NULL DEFAULT current_date,
notes VARCHAR NULL DEFAULT NULL,
FOREIGN KEY (request_id, candidate_id) REFERENCES process(request_id, candidate_id),
FOREIGN KEY (workflow, phase_id) REFERENCES workflow_phase(workflow, phase_id),
PRIMARY KEY (request_id, candidate_id, workflow, phase_id)
);

CREATE TABLE candidate_request_profile(
candidate_id INT,
profile VARCHAR,
FOREIGN KEY (candidate_id) REFERENCES candidate(candidate_id),
FOREIGN KEY (profile) REFERENCES request_profile(request_profile),
PRIMARY KEY (candidate_id, profile)
);

