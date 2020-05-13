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
	('French');
	
INSERT INTO workflow
	VALUES 
	('Software Development'),
	('Software Testing'),
	('Consulting');
	
INSERT INTO months
	VALUES 
	('January'),
	('February'),
	('March'),
	('April'),
	('May'),
	('June'),
	('July'),
	('August'),
	('September'),
	('October'),
	('November'),
	('December');
	
INSERT INTO request(quantity, description, target_date, 
		request_state, request_skill, request_state_csl, 
		request_project, request_profile, workflow)
	VALUES
	(2, 'Xamarin', 'October', 'Open', 'IS', 'Asked', 'Not defined yet', '.Net', 'Software Development'),
	(3, 'Experiência em Testes', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing'),
	(1, 'Swat 1 Person', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Consulting'),
	(2, 'Swat 2 People', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing');
	
INSERT INTO user_role_request(user_id, role_id, request_id)
	VALUES 
	(1, 1, 1),
	(1, 1, 2),
	(1, 1, 3),
	(1, 1, 4);
	
INSERT INTO request_language_requirements(request_id, language, mandatory)
	VALUES
	(1, 'English', TRUE),
	(1, 'French', FALSE),
	
	(2, 'English', TRUE),
	(2, 'French', TRUE),
	
	(3, 'English', TRUE),
	(4, 'English', TRUE);
	
	
INSERT INTO phase
	VALUES 
	('First Interview'),
	('Technicall Interview'),
	('First Interview And Technicall Interview'),
	('Job Offer'),
	('Offer Accepted');
	
INSERT INTO workflow_phase(workflow, phase, phase_number)
	VALUES
	('Software Development', 'First Interview', 1),
	('Software Development', 'Technicall Interview', 2),
	('Software Development', 'Job Offer', 3),
	('Software Development', 'Offer Accepted', 4),
	
	('Software Testing', 'First Interview And Technicall Interview', 1),
	('Software Testing', 'Job Offer', 2),
	('Software Testing', 'Offer Accepted', 3),
	
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
	
INSERT INTO candidate_request_profile(candidate_id, profile)
	VALUES
	(4, '.Net'),
	(4, '.Net 3 anos'),
	(4, '.Net Júnior');	
	
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
	
INSERT INTO process_phase(request_id, candidate_id, phase, notes, process_current_phase)
	VALUES
	(1, 1, 'First Interview', 'First Interview went well. Profile Info added!', FALSE),
	(1, 1, 'Technicall Interview', 'Good Technical Interview', FALSE),
	(1, 1, 'Job Offer', NULL, FALSE),
	(1, 1, 'Offer Accepted', 'Candidate accepted offer.', TRUE),
	
	(1, 2, 'First Interview', NULL, TRUE),
	
	(1, 3, 'First Interview', NULL, FALSE),
	(1, 3, 'Technicall Interview', NULL, TRUE),
	
	(1, 4, 'First Interview', NULL, TRUE);
	
INSERT INTO dynamic_info(info_name, json_info)
	VALUES
	('interview_details',	'{"name" : "interview_details", "type": "text"}'),
	('interview_score', 	'{"name" : "interview_score", 	"type": "number"}'),
	('salary', 				'{"name" : "salary", 			"type" : "number"}'),
	('starting_date', 		'{"name" : "starting_date", 	"type" : "date"}');
	
INSERT INTO phase_info(phase, info_name)
	VALUES 
	('First Interview', 'interview_details'),
	
	('Technicall Interview', 'interview_score'),
	
	('First Interview And Technicall Interview', 'interview_details'),
	('First Interview And Technicall Interview', 'interview_score'),
	
	('Job Offer', 'salary'),
	
	('Offer Accepted', 'starting_date');

INSERT INTO process_info(request_id, candidate_id, info_name, info_value)
	VALUES
	(1, 1, 'interview_details', '{"value" : "Interview went well with candidate"}'),
	(1, 1, 'interview_score', '{"value" : "75"}'),
	(1, 1, 'salary', '{"value" : "900"}'),
	(1, 1, 'starting_date', '{"value" : "..."}');
	
	