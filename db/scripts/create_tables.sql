-- Por cada tabela que seja preciso guardar histórico será
-- criada uma nova tabela, com as mesmas colunas mas sem chaves,
-- que irá guardar o histórico de inserts/updates/deletes bem como
-- o user responsável pelas alterações e a data de alteração.
--
-- Decidir que tabelas guardar histórico!
--
-- ON DELETE/UPDATE CASCADE, triggers(histórico, Request.progress)?
--	



-- Users + Roles

CREATE TABLE user_profile(
user_id INT GENERATED ALWAYS AS IDENTITY,
username VARCHAR UNIQUE NOT NULL,
password_hash VARCHAR NOT NULL,
is_active BOOLEAN NOT NULL DEFAULT TRUE,
PRIMARY KEY (user_id)
);

CREATE TABLE role(
role_id INT GENERATED ALWAYS AS IDENTITY,
role VARCHAR UNIQUE NOT NULL,
description VARCHAR NOT NULL,
PRIMARY KEY (role_id)
);

CREATE TABLE user_role(
user_id INT,
role_id INT,
FOREIGN KEY (user_id) REFERENCES user_profile(user_id),
FOREIGN KEY (role_id) REFERENCES role(role_id),
PRIMARY KEY (user_id, role_id)
);

-- Opportunity/Request attributes
--
-- Todas estas tabelas tem a mesma estrutura(id, name, description)
-- Há problema? Deveriamos mudar para uma tabela genérica? 
-- Fica feio assim..


CREATE TABLE request_state(
state_id INT GENERATED ALWAYS AS IDENTITY,
request_state VARCHAR UNIQUE NOT NULL,
description VARCHAR NOT NULL,
PRIMARY KEY (state_id)
);

CREATE TABLE request_skill(
skill_id INT GENERATED ALWAYS AS IDENTITY,
request_skill VARCHAR UNIQUE NOT NULL,
description VARCHAR NOT NULL,
PRIMARY KEY (skill_id)
);

CREATE TABLE request_state_csl(
state_csl_id INT GENERATED ALWAYS AS IDENTITY,
request_state_csl VARCHAR UNIQUE NOT NULL,
description VARCHAR NOT NULL,
PRIMARY KEY (state_csl_id)
);

CREATE TABLE request_project(
project_id INT GENERATED ALWAYS AS IDENTITY,
request_project VARCHAR UNIQUE NOT NULL,
description VARCHAR NOT NULL,
PRIMARY KEY (project_id)
);

CREATE TABLE request_profile(
profile_id INT GENERATED ALWAYS AS IDENTITY,
request_profile VARCHAR UNIQUE NOT NULL,
description VARCHAR NOT NULL,
PRIMARY KEY (profile_id)
);

-- Request, User_Role_Request, 

CREATE TABLE request(
request_id INT GENERATED ALWAYS AS IDENTITY,
quantity INT NOT NULL CHECK(quantity > 0),
description VARCHAR NOT NULL,
request_date DATE NOT NULL DEFAULT CURRENT_DATE,
target_date DATE NOT NULL, -- mês -> varchar ou ints(1-12) em vez de DATE
state_id INT,
skill_id INT,
state_csl_id INT,
project_id INT NULL,
profile_id INT,
date_to_send_profile DATE NULL,
anglophone BOOLEAN NOT NULL, -- E se quisermos mais linguagens??
francophone BOOLEAN NOT NULL, -- Tabela genérica -> Language Requirements?
progress INT NOT NULL DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
FOREIGN KEY (state_id) REFERENCES request_state(state_id),
FOREIGN KEY (skill_id) REFERENCES request_skill(skill_id),
FOREIGN KEY (state_csl_id) REFERENCES request_state_csl(state_csl_id),
FOREIGN KEY (project_id) REFERENCES request_project(project_id),
FOREIGN KEY (profile_id) REFERENCES request_profile(profile_id),
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

-- Phase, Request_Phase

CREATE TABLE phase(
phase_id INT GENERATED ALWAYS AS IDENTITY,
phase VARCHAR UNIQUE NOT NULL,
description VARCHAR NOT NULL,
PRIMARY KEY (phase_id)
);

CREATE TABLE request_phase(
request_id INT,
phase_id INT,
FOREIGN KEY (request_id) REFERENCES request(request_id),
FOREIGN KEY (phase_id) REFERENCES phase(phase_id),
PRIMARY KEY (request_id, phase_id)
);


-- Candidate, Candidate_Request_Phase, Candidate_Request_Profile

CREATE TABLE candidate(
candidate_id INT GENERATED ALWAYS AS IDENTITY,	
name VARCHAR NOT NULL,
cv VARCHAR NOT NULL, -- blop
available BOOLEAN NOT NULL DEFAULT TRUE,
PRIMARY KEY (candidate_id)	
);
 
-- adicionar atributo notes?
CREATE TABLE candidate_request_phase(
request_id INT,
phase_id INT,
candidate_id INT,
phase_date DATE NOT NULL,
present BOOLEAN NOT NULL,
unavailability_reason VARCHAR NULL,
FOREIGN KEY (request_id, phase_id) REFERENCES request_phase(request_id, phase_id),
FOREIGN KEY (candidate_id) REFERENCES candidate(candidate_id),
PRIMARY KEY (request_id, phase_id, candidate_id)
); 


CREATE TABLE candidate_request_profile(
candidate_id INT,
profile_id INT,
FOREIGN KEY (candidate_id) REFERENCES candidate(candidate_id),
FOREIGN KEY (profile_id) REFERENCES request_profile(profile_id),
PRIMARY KEY (candidate_id, profile_id)
);

-- Process, Process_Status

CREATE TABLE process_status(
status_id INT GENERATED ALWAYS AS IDENTITY,
status VARCHAR UNIQUE NOT NULL,
description VARCHAR NOT NULL,
PRIMARY KEY (status_id)
);


CREATE TABLE process(
request_id INT,
candidate_id INT,
status_id INT,
score INT NULL,
notes VARCHAR NULL,
starting_date DATE NULL,
FOREIGN KEY (request_id) REFERENCES request(request_id),
FOREIGN KEY (candidate_id) REFERENCES candidate(candidate_id),
FOREIGN KEY (status_id) REFERENCES process_status(status_id),
PRIMARY KEY (request_id, candidate_id)
);





