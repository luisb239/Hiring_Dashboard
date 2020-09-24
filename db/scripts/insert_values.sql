
INSERT INTO "User" (username, password) 
VALUES 
	/*('superuser', 'superuser'),*/
	('A44015@alunos.isel.pt', NULL),
	('A43553@alunos.isel.pt', NULL),
	('A43520@alunos.isel.pt', NULL);
	
INSERT INTO "UserRoles" ("UserId", "RoleId", active, start_date, updater) 
VALUES    
    /*(2, 1, true, CURRENT_DATE, 1),*/
	(2, 3, true, CURRENT_DATE, 1),
	(2, 2, true, CURRENT_DATE, 1),
    (3, 1, true, CURRENT_DATE, 1),
	(3, 2, true, CURRENT_DATE, 1),
    (4, 2, true, CURRENT_DATE, 1);
	
	
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
	
INSERT INTO request(quantity, description, target_date, request_state, 
request_skill, request_state_csl, request_project, request_profile, 
workflow, request_date, date_to_send_profile, progress, temp)
	VALUES
	(2, 'Xamarin', 'October', 'Open', 'IS', 'Asked', 'Not defined yet', '.Net', 'Software Development', CURRENT_DATE, NULL, 50, CURRENT_TIMESTAMP),
	(3, 'Experiência em Testes', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	
	(3, 'Software Testing - Example 1', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Testing - Example 2', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Testing - Example 3', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Testing - Example 4', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Testing - Example 5', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Testing - Example 6', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Testing - Example 7', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Testing - Example 8', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Testing - Example 9', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Testing - Example 10', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	
	(3, 'Software Development - Example 1', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Development - Example 2', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Development - Example 3', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Development - Example 4', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Development - Example 5', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Development - Example 6', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Development - Example 7', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Development - Example 8', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Development - Example 9', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Software Development - Example 10', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Software Testing', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	
	(3, 'Consulting - Example 1', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Consulting', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Consulting - Example 2', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Consulting', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Consulting - Example 3', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Consulting', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Consulting - Example 4', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Consulting', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Consulting - Example 5', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Consulting', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Consulting - Example 6', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Consulting', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Consulting - Example 7', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Consulting', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Consulting - Example 8', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Consulting', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Consulting - Example 9', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Consulting', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP),
	(3, 'Consulting - Example 10', 'December', 'Open', 'IS', 'Asked', 'XPO', 'Tester', 'Consulting', CURRENT_DATE, NULL, 0, CURRENT_TIMESTAMP);
	

INSERT INTO user_role_request(user_id, role_id, request_id)
	VALUES 
	(2, 2, 1),
	(2, 2, 2),
	(2, 2, 3),
	(2, 2, 4),
	(2, 2, 5),
	(2, 2, 6),
	(2, 2, 7),
	(2, 2, 8),
	(2, 2, 9),
	(2, 2, 10),
	(2, 2, 11),
	(2, 2, 12),
	(2, 2, 13),
	(2, 2, 14),
	(2, 2, 15),
	(2, 2, 16),
	(2, 2, 17),
	(2, 2, 18),
	(2, 2, 19),
	(2, 2, 20),
	(2, 2, 21),
	(2, 2, 22),
	(2, 2, 23),
	(2, 2, 24),
	(2, 2, 25),
	(2, 2, 26),
	(2, 2, 27),
	(2, 2, 28),
	(2, 2, 29),
	(2, 2, 30),
	(2, 2, 31),
	(2, 2, 32),
	
	(3, 1, 1),
	(3, 1, 2),
	(3, 1, 3),
	(3, 1, 4),
	(3, 1, 5),
	(3, 1, 6),
	(3, 1, 7),
	(3, 1, 8),
	(3, 1, 9),
	(3, 1, 10),
	(3, 1, 11),
	(3, 1, 12),
	(3, 1, 13),
	(3, 1, 14),
	(3, 1, 15),
	(3, 1, 16),
	(3, 1, 17),
	(3, 1, 18),
	(3, 1, 19),
	(3, 1, 20),
	(3, 1, 21),
	(3, 1, 22),
	(3, 1, 23),
	(3, 1, 24),
	(3, 1, 25),
	(3, 1, 26),
	(3, 1, 27),
	(3, 1, 28),
	(3, 1, 29),
	(3, 1, 30),
	(3, 1, 31),
	(3, 1, 32);

INSERT INTO request_language_requirements(request_id, language, mandatory)
	VALUES
	(1, 'English', TRUE),
	(1, 'French', FALSE),
	
	(2, 'English', TRUE),
	(2, 'French', TRUE);
	
	
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

INSERT INTO candidate(name, available, cv, cv_mime_type, cv_filename, cv_encoding, cv_version_id, profile_info, temp)
    VALUES
    ('Michael Corleone', TRUE, NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP),
    ('Travis Bickle', TRUE, NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP),
    ('Randle McMurphy', TRUE, NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP),
    ('Ellen Ripley', TRUE, NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP),
    ('Bob Belcher', TRUE, NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP),
    ('Troy Barnes', FALSE, NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP);
	
INSERT INTO candidate_request_profile(candidate_id, profile)
	VALUES
	(4, '.Net'),
	(4, '.Net 3 anos'),
	(4, '.Net Júnior'),
	(1, '.Net'),
	(1, 'Tester'),
	(2, 'Dev. Java'),
	(2, 'Tester'),
	(5, 'Analista Funcional');
	
	
INSERT INTO process_status(status)
	VALUES
	('Placed'),
	('Onhold'),
	('Offer Rejected'),
	('Rejected Client'),
	('Rejected HM'),
	('Withdrawn');
	
INSERT INTO process(request_id, candidate_id, status, temp)
	VALUES
	(1, 1, 'Placed', CURRENT_TIMESTAMP),
	(1, 2, 'Onhold', CURRENT_TIMESTAMP),
	(1, 3, 'Offer Rejected', CURRENT_TIMESTAMP),
	(1, 4, 'Withdrawn', CURRENT_TIMESTAMP),
	
	(2, 1, 'Onhold', CURRENT_TIMESTAMP),
	(2, 2, 'Withdrawn', CURRENT_TIMESTAMP),
	(2, 3, 'Onhold', CURRENT_TIMESTAMP),
	(2, 4, 'Onhold', CURRENT_TIMESTAMP);
	
INSERT INTO unavailable_reason(reason)
	VALUES
	('Candidate withdrawned from proposal'),
	('Candidate rejected');
	
INSERT INTO process_unavailable_reason(request_id, candidate_id, reason)
	VALUES
	(1, 4, 'Candidate withdrawned from proposal');
	
INSERT INTO process_phase(request_id, candidate_id, phase, notes, start_date, update_date)
	VALUES
	(1, 1, 'First Interview', 'First Interview went well. Profile Info added!', CURRENT_DATE, NULL),
	(1, 1, 'Technicall Interview', 'Good Technical Interview', CURRENT_DATE, NULL),
	(1, 1, 'Job Offer', NULL, CURRENT_DATE, NULL),
	(1, 1, 'Offer Accepted', 'Candidate accepted offer.', CURRENT_DATE, NULL),
	
	(1, 2, 'First Interview', NULL, CURRENT_DATE, NULL),
	
	(1, 3, 'First Interview', NULL, CURRENT_DATE, NULL),
	(1, 3, 'Technicall Interview', NULL, CURRENT_DATE, NULL),
	
	(1, 4, 'First Interview', NULL, CURRENT_DATE, NULL),
	
	(2, 1, 'First Interview And Technicall Interview', NULL, CURRENT_DATE, NULL),
	
	(2, 2, 'First Interview And Technicall Interview', NULL, CURRENT_DATE, NULL),
	(2, 2, 'Job Offer', NULL, CURRENT_DATE, NULL),
	
	(2, 3, 'First Interview And Technicall Interview', NULL, CURRENT_DATE, NULL),
	(2, 3, 'Job Offer', NULL, CURRENT_DATE, NULL),
	(2, 3, 'Offer Accepted', NULL, CURRENT_DATE, NULL),
	
	(2, 4, 'First Interview And Technicall Interview', NULL, CURRENT_DATE, NULL);
	
INSERT INTO process_current_phase(request_id, candidate_id, current_phase)
	VALUES 
	(1, 1, 'Offer Accepted'),
	(1, 2, 'First Interview'),
	(1, 3, 'Technicall Interview'),
	(1, 4, 'First Interview'),
	
	(2, 1, 'First Interview And Technicall Interview'),
	(2, 2, 'Job Offer'),
	(2, 3, 'Offer Accepted'),
	(2, 4, 'First Interview And Technicall Interview');
	
INSERT INTO dynamic_info(info_name, json_info)
	VALUES
	('Interview Details',	'{"name" : "interview_details", "type": "text"}'),
	('Interview Score', 	'{"name" : "interview_score", 	"type": "number"}'),
	('Salary', 				'{"name" : "salary", 			"type" : "number"}'),
	('Starting Date', 		'{"name" : "starting_date", 	"type" : "date"}');
	
INSERT INTO phase_info(phase, info_name)
	VALUES 
	('First Interview', 'Interview Details'),
	
	('Technicall Interview', 'Interview Score'),
	
	('First Interview And Technicall Interview', 'Interview Details'),
	('First Interview And Technicall Interview', 'Interview Score'),
	
	('Job Offer', 'Salary'),
	
	('Offer Accepted', 'Starting Date');

INSERT INTO process_info(request_id, candidate_id, info_name, info_value)
	VALUES
	(1, 1, 'Interview Details', '{"value" : "Interview went well with candidate"}'),
	(1, 1, 'Interview Score', '{"value" : "75"}'),
	(1, 1, 'Salary', '{"value" : "900"}'),
	(1, 1, 'Starting Date', '{"value" : "2020-01-26"}');
