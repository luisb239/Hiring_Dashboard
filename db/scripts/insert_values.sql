

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
	(1,1,1),
	(2,2,2),
	(3,2,1);
	
INSERT INTO request_state(request_state)
	VALUES
	('Open'),
	('Closed'),
	('Inactive');
	
INSERT INTO request_skill(request_skill)
	VALUES
	('IS'),
	('MVS'),
	('SWEED'),
	('SWAT');
	
INSERT INTO request_state_csl(request_state_csl)
	VALUES
	('Asked'),
	('Withdrawn'),
	('Satisfied with external'),
	('Supended');
	
INSERT INTO request_project(request_project)
	VALUES
	('Not defined yet'),
	('XPO'),
	('Europcar'),
	('Portal do Cidadão'),
	('CNFPT');
	
INSERT INTO request_profile(request_profile)
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
	
INSERT INTO request_language(language)
	VALUES
	('English'),
	('French'),
	('Russian');
	
INSERT INTO workflow(worKflow_name)
	VALUES
	('Software Development'),
	('Software Testing'),
	('Consulting');
	
INSERT INTO request(quantity, description, target_date, 
		state_id, skill_id, state_csl_id, project_id, profile_id,
		workflow_id)
	VALUES
	(2, 'Xamarin', 'October', 1, 1, 1, 1, 1, 1),
	(3, 'Experiência em Testes', 'December', 1, 4, 1, 2, 13, 2);
	
INSERT INTO user_role_request(user_id, role_id, request_id)
	VALUES 
	(1, 1, 1),
	(2, 2, 1),
	(1, 1, 2),
	(2, 2, 2);
	
INSERT INTO request_language_requirements(request_id, language_id, yes_valued)
	VALUES
	(1, 1, TRUE),
	(1, 2, FALSE),
	(2, 1, TRUE),
	(2, 2, TRUE);
	
INSERT INTO phase(phase)
	VALUES 
	('First Interview'),
	('Technicall Interview'),
	('First Interview + Technicall Interview'),
	('Job Offer'),
	('Offer Accepted');
	
INSERT INTO workflow_phase(workflow_id, phase_id, phase_number)
	VALUES
	(1, 1, 1),
	(1, 2, 2),
	(1, 4, 3),
	(1, 5, 4),
	
	(2, 3, 1),
	(2, 4, 2),
	(2, 5, 3);
	
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
	
INSERT INTO process(request_id, candidate_id, status_id)
	VALUES
	(1, 1, 1),
	(1, 2, 2),
	(1, 3, 3),
	(1, 4, 6);
	
INSERT INTO unavailable_reason(reason)
	VALUES
	('Candidate withdrawned from proposal');
	
INSERT INTO process_unavailable_reason(request_id, candidate_id, reason_id)
	VALUES
	(1, 4, 1);
	
INSERT INTO process_workflow_phase(request_id, candidate_id, workflow_id, phase_id, notes)
	VALUES
	(1, 1, 1, 1, 'First Interview went well. Profile Info added!'),
	(1, 1, 1, 2, 'Good Technicall Interview'),
	(1, 1, 1, 4, '..'),
	(1, 1, 1, 5, 'Candidate accepted offer.');
	
INSERT INTO candidate_request_profile(candidate_id, profile_id)
	VALUES
	(4, 1),
	(4, 2),
	(4, 3);	