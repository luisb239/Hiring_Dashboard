import { Component, OnInit } from '@angular/core';
import { RequestSkill } from 'src/app/model/request-skill';
import { RequestState } from 'src/app/model/request-state';
import { RequestStateCsl } from 'src/app/model/request-state-csl';
import { RequestProject } from 'src/app/model/request-project';
import { RequestProfile } from 'src/app/model/request-profile';
import { Workflow } from 'src/app/model/workflow';
import { RequestPropsService } from 'src/app/services/requestProps/requestProps.service';
import {WorkflowService} from 'src/app/services/workflow/workflow.service';
import { RequestLanguage } from 'src/app/model/request-language';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  constructor(private reqPropsService: RequestPropsService, private workflowService: WorkflowService) { }
  // skills: RequestSkill[] = [new RequestSkill('SWAT'), new RequestSkill('SEED')];
  // states: RequestState[] = [new RequestState('Open'), new RequestState('Closed')];
  // statesCsl: RequestStateCsl[] = [new RequestStateCsl('Requested'), new RequestStateCsl('Fulfilled')];
  // projects: RequestProject[] = [new RequestProject('XPO'), new RequestProject('Portal do Cidadão')];
  // profiles: RequestProfile[] = [new RequestProfile('Dev. Mobile'), new RequestProfile('Tester')];
  // workflows: Workflow[] = [new Workflow('Developer'), new Workflow('Recruitment Team')];

  // createRequest: Create_Request = new Create_Request(
  //   'Testing Description',
  //   this.skills,
  //   this.states,
  //   this.statesCsl,
  //   this.projects,
  //   this.profiles,
  //   this.workflows);

  skills: RequestSkill[];
  states: RequestState[];
  statesCsl: RequestStateCsl[];
  profiles: RequestProfile[];
  projects: RequestProject[];
  workflows: Workflow[];
  languages: RequestLanguage[];
  ngOnInit(): void {
    this.reqPropsService.getRequestSkills()
      .subscribe(skills => { this.skills = skills.map(s => new RequestSkill(s.id)); },
        error => { console.log(error); });

    this.reqPropsService.getRequestStates()
      .subscribe(states => { this.states = states.map(s => new RequestState(s.id)); },
        error => { console.log(error); });

    this.reqPropsService.getRequestStatesCsl()
      .subscribe(statesCsl => { this.statesCsl = statesCsl.map(s => new RequestStateCsl(s.id)); },
        error => { console.log(error); });

    this.reqPropsService.getRequestProjects()
      .subscribe(projects => { this.projects = projects.map(p => new RequestProject(p.id)); },
        error => { console.log(error); });

    this.reqPropsService.getRequestProfiles()
      .subscribe(profiles => { this.profiles = profiles.map(p => new RequestProfile(p.id)); },
        error => { console.log(error); });

    this.reqPropsService.getRequestLanguages()
      .subscribe(languages => { this.languages = languages.map(l => new RequestLanguage(l.id)); },
        error => { console.log(error); });

    this.workflowService.getAllWorkflows()
      .subscribe(workflows => { this.workflows = workflows.map(w => new Workflow(w.id, [])); },
        error => { console.log(error); });
  }


}
