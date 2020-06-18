


--DROP TABLE public."User_Session";
--DROP TABLE public."User_History";
--DROP TABLE public."UserRoles";
--DROP TABLE public."UserList";
--DROP TABLE public."RolePermission";

--DROP TABLE public."Protocols";
--DROP TABLE public."Idp";
--DROP TABLE public."List";
--DROP TABLE public."Role";
--DROP TABLE public."Permission";
--DROP TABLE public."Session";
--DROP TABLE public."User";


INSERT INTO user_profile(user_id, is_active)
	VALUES 
	(2, 'A44015@alunos.isel.pt', TRUE),
	(3, 'A43553@alunos.isel.pt' , TRUE),
	(4, 'A43520@alunos.isel.pt', TRUE);
	
INSERT INTO role(role_id)
	VALUES	
	(1),
	(2);
	
INSERT INTO role_type(role_type) 
	VALUES
	('Team Worker'),
	('Team Leader');
	
INSERT INTO user_role(user_id, role_id, role_type)
	VALUES	
	(1, 1, 'Team Leader');
	
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
	(3, 'Experiência em Testes', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing');
	--(1, 'Swat 1 Person', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Consulting'),
	--(2, 'Swat 2 People', 'December', 'Open', 'SWAT', 'Asked', 'XPO', 'Tester', 'Software Testing');
	
INSERT INTO user_role_request(user_id, role_id, request_id)
	VALUES 
	(1, 1, 1),
	(1, 1, 2);
	--(1, 1, 3),
	--(1, 1, 4);

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
	(1, 4, 'Withdrawn'),
	
	(2, 1, 'Onhold'),
	(2, 2, 'Onhold'),
	(2, 3, 'Onhold'),
	(2, 4, 'Onhold');
	
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
	
	(1, 4, 'First Interview', NULL),
	
	(2, 1, 'First Interview And Technicall Interview', NULL),
	
	(2, 2, 'First Interview And Technicall Interview', NULL),
	(2, 2, 'Job Offer', NULL),
	
	(2, 3, 'First Interview And Technicall Interview', NULL),
	(2, 3, 'Job Offer', NULL),
	(2, 3, 'Offer Accepted', NULL),
	
	(2, 4, 'First Interview And Technicall Interview', NULL);
	
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
	
	