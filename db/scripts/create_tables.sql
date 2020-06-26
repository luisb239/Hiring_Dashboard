CREATE TABLE "Permission"(
id SERIAL PRIMARY KEY,
action VARCHAR(255),
resource VARCHAR(255)
);

CREATE TABLE "Protocols"(
protocol VARCHAR(255) PRIMARY KEY,
active boolean
);

CREATE TABLE "Role"(
id SERIAL PRIMARY KEY,
role VARCHAR(255) NOT NULL UNIQUE,
parent_role INT NULL
);

CREATE TABLE "RolePermission"(
"RoleId" INT ,
"PermissionId" INT,
FOREIGN KEY ("RoleId") REFERENCES "Role"(id) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY ("PermissionId") REFERENCES "Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE,
PRIMARY KEY("RoleId", "PermissionId")
);

CREATE TABLE "User"(
id SERIAL PRIMARY KEY,
username VARCHAR(255) UNIQUE NOT NULL,
PASSWORD VARCHAR(255)
);

CREATE TABLE "User_History"(
id SERIAL PRIMARY KEY,
date TIMESTAMP WITH TIME ZONE NOT NULL,
description VARCHAR(255),
user_id INT,
FOREIGN KEY(user_id) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE "User_Session"(
session_id VARCHAR(255) PRIMARY KEY,
user_id INT,
FOREIGN KEY (user_id) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE "List"(
id SERIAL PRIMARY KEY,
list VARCHAR(255) UNIQUE
);

CREATE TABLE "UserList"(
start_date TIMESTAMP WITH TIME ZONE,
end_date TIMESTAMP WITH TIME ZONE,
updater INT,
active BOOLEAN,
"ListId" INT NOT NULL,
"UserId" INT NOT NULL,
FOREIGN KEY("ListId") REFERENCES "List"(id) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY("UserId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE,
PRIMARY KEY("ListId", "UserId")
);

CREATE TABLE "Idp"(
id SERIAL PRIMARY KEY,
idp_id VARCHAR(1234),
idpname VARCHAR(255),
user_id INT,
FOREIGN KEY(user_id) REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE "UserRoles"(
start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
end_date TIMESTAMP WITH TIME ZONE NULL DEFAULT NULL,
updater INT NULL DEFAULT NULL,
active BOOLEAN,
"RoleId" INT,
"UserId" INT,
FOREIGN KEY("RoleId") REFERENCES "Role"(id) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY("UserId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE,
PRIMARY KEY("RoleId", "UserId")
);


CREATE TABLE user_profile(
user_id INT,		
user_email text NOT NULL UNIQUE,
is_active BOOLEAN NOT NULL,
PRIMARY KEY (user_id)
);


CREATE TABLE role(
role_id INT PRIMARY KEY
);

CREATE TABLE role_type(
role_type VARCHAR PRIMARY KEY
);

CREATE TABLE user_role(
user_id INT,
role_id INT,
role_type VARCHAR,
FOREIGN KEY (user_id) REFERENCES user_profile(user_id),
FOREIGN KEY (role_id) REFERENCES role(role_id),
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

CREATE TABLE request(
request_id INT GENERATED ALWAYS AS IDENTITY,
quantity INT NOT NULL /* CHECK(quantity > 0) */,
description VARCHAR NOT NULL,
request_date DATE NOT NULL DEFAULT CURRENT_DATE,
target_date VARCHAR NOT NULL,
request_state VARCHAR NOT NULL,
request_skill VARCHAR NOT NULL,
request_state_csl VARCHAR NOT NULL,
request_project VARCHAR NOT NULL,
request_profile VARCHAR NOT NULL,
workflow VARCHAR NOT NULL,
date_to_send_profile DATE NULL DEFAULT NULL,
progress INT NOT NULL DEFAULT 0 /*  CHECK(progress >= 0 AND progress <= 100) */,
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
cv BYTEA NULL, -- blop
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
