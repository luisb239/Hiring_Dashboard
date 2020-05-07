import {Component, OnInit} from '@angular/core';
import {Create_Request} from 'src/app/model/create-request';
import {RequestSkill} from 'src/app/model/request-skill';
import {RequestState} from 'src/app/model/request-state';
import {RequestStateCsl} from 'src/app/model/request-state-csl';
import {RequestProject} from 'src/app/model/request-project';
import {RequestProfile} from 'src/app/model/request-profile';
import {Workflow} from 'src/app/model/workflow';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  constructor() {
  }

  skills: RequestSkill[] = [new RequestSkill('SWAT'), new RequestSkill('SEED')];
  states: RequestState[] = [new RequestState('Open'), new RequestState('Closed')];
  statesCsl: RequestStateCsl[] = [new RequestStateCsl('Requested'), new RequestStateCsl('Fulfilled')];
  projects: RequestProject[] = [new RequestProject('XPO'), new RequestProject('Portal do Cidadão')];
  profiles: RequestProfile[] = [new RequestProfile('Dev. Mobile'), new RequestProfile('Tester')];
  workflows: Workflow[] = [new Workflow('Developer'), new Workflow('Recruitment Team')];

  createRequest: Create_Request = new Create_Request(
    'Testing Description',
    this.skills,
    this.states,
    this.statesCsl,
    this.projects,
    this.profiles,
    this.workflows);

  ngOnInit(): void {
  }


}
