

INSERT INTO user_profile(username, password_hash)
	VALUES 
	('John Malkovich', 'zxhjcor0a98ra'),
	('Nick Cave', 'zxhjcor0a98ra'),
	('Joanna Newsom', 'zxhjcor0a98ra');
	
INSERT INTO role(role)
	VALUES	
	('Opportunity Owner'),
	('Recruiter');
	
INSERT INTO role_type(role_type)
	VALUES
	('Team Worker'),
	('Team Leader');
	
INSERT INTO user_role(user_id, role_id, role_type_id)
	VALUES	
	(1,1,1);
	
INSERT INTO request_state
	VALUES
	('Open'),
	('Closed'),
	('Inactive');
	
INSERT INTO request_skill
	VALUES
	('IS'),
	('MVS'),
	('SWEED'),
	('SWAT');
	
INSERT INTO request_state_csl
	VALUES
	('Asked'),
	('Withdrawn'),
	('Satisfied with external'),
	('Supended');
	
INSERT INTO request_project
	VALUES
	('Not defined yet'),
	('XPO'),
	('Europcar'),
	('Portal do Cidadão'),
	('CNFPT');
	
INSERT INTO request_profile
	VALUES
	('.Net'),
	('.Net 3 anos'),
	('.Net Júnior'),
	('Analista Funcional'),
	('Arquiteto .Net/Php'),
	('CP Mainframe'),
	('Dev. .Net'),
	('Dev. Php'),
	('Dev. Jahia (Java)'),
	('Dev. Java'),
	('Dev. Java Fullstack'),
	('Dev. Mobile'),
	('Tester');
	
INSERT INTO request_language
	VALUES
	('English'),
	('French'),
	('Russian');
	
INSERT INTO workflow(workflow)
	VALUES 
	('Software Development'),
	('Software Testing'),
	('Consulting');
	
INSERT INTO request(quantity, description, target_date, 
		request_state, request_skill, request_state_csl, 
		request_project, request_profile, request_workflow)
	VALUES
	(2, 'Xamarin', 'October', 'Open', 'IS', 'Asked', 'Not defined yet', '.Net', 'Software Development'),
	(3, 'Experiência em Testes', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing'),
	(1, 'Random1', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Consulting'),
	(2, 'Random2', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing');
	
INSERT INTO user_role_request(user_id, role_id, request_id)
	VALUES 
	(1, 1, 1),
	(1, 1, 2),
	(1, 1, 3),
	(1, 1, 4);
	
INSERT INTO request_language_requirements(request_id, language, yes_valued)
	VALUES
	(1, 'English', TRUE),
	(1, 'French', FALSE),
	(2, 'English', TRUE),
	(2, 'French', TRUE),
	(3, 'English', TRUE),
	(4, 'English', TRUE);
	
	
INSERT INTO phase(phase, phase_attributes)
	VALUES 
	('First Interview', NULL),
	('Technicall Interview', '{"interview_details" : null, "score" : 0, "seniority" : null}'),
	('First Interview + Technicall Interview', '{"interview_details" : null, "score" : 0, "seniority" : null}'),
	('Job Offer', '{"relevant_remarks" : null, "starting_date" : "null"}'),
	('Offer Accepted', '{"salary" : 0}');
	
INSERT INTO workflow_phase(workflow, phase, phase_number)
	VALUES
	('Software Development', 'First Interview', 1/*, NULL*/),
	('Software Development', 'Technicall Interview', 2 /*,'{"interview_details" : null, "score" : 0, "seniority" : null}'*/),
	('Software Development', 'Job Offer', 3/*, '{"relevant_remarks" : null}'*/),
	('Software Development', 'Offer Accepted', 4/*, '{"starting_date" : null}'*/),
	
	('Software Testing', 'First Interview + Technicall Interview', 1/*, '{"interview_details" : null, "score" : 0, "seniority" : null}'*/),
	('Software Testing', 'Job Offer', 2/*, '{"relevant_remarks" : null}'*/),
	('Software Testing', 'Offer Accepted', 3/*, '{"starting_date" : null}'*/),
	
	('Consulting', 'First Interview', 1),
	('Consulting', 'Technicall Interview', 2),
	('Consulting', 'Job Offer', 3),
	('Consulting', 'Offer Accepted', 4);

INSERT INTO candidate(name)
	VALUES
	('Michael Corleone'),
	('Travis Bickle'),
	('Randle McMurphy'),
	('Ellen Ripley');
	
INSERT INTO process_status(status)
	VALUES
	('Placed'),
	('Onhold'),
	('Offer Rejected'),
	('Rejected Client'),
	('Rejected HM'),
	('Withdrawn');
	
INSERT INTO process(request_id, candidate_id, status)
	VALUES
	(1, 1, 'Placed'),
	(1, 2, 'Onhold'),
	(1, 3, 'Offer Rejected'),
	(1, 4, 'Withdrawn');
	
INSERT INTO unavailable_reason(reason)
	VALUES
	('Candidate withdrawned from proposal');
	
INSERT INTO process_unavailable_reason(request_id, candidate_id, reason)
	VALUES
	(1, 4, 'Candidate withdrawned from proposal');
	
INSERT INTO process_phase(request_id, candidate_id, phase, notes)
	VALUES
	(1, 1, 'First Interview', 'First Interview went well. Profile Info added!'),
	(1, 1, 'Technicall Interview', 'Good Technical Interview'),
	(1, 1, 'Job Offer', NULL),
	(1, 1, 'Offer Accepted', 'Candidate accepted offer.'),
	
	(1, 2, 'First Interview', NULL),
	(1, 3, 'First Interview', NULL),
	(1, 3, 'Technicall Interview', NULL),
	(1, 4, 'First Interview', NULL);
	
INSERT INTO candidate_request_profile(candidate_id, profile)
	VALUES
	(4, '.Net'),
	(4, '.Net 3 anos'),
	(4, '.Net Júnior');	

