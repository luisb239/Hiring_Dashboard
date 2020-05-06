import { Component, OnInit } from '@angular/core';
import { Create_Request } from 'src/app/model/create-request';
import { Request_Skill } from 'src/app/model/request_skill';
import { Request_State } from 'src/app/model/request_state';
import { Request_State_Csl } from 'src/app/model/request_state_csl';
import { Request_Project } from 'src/app/model/request_project';
import { Request_Profile } from 'src/app/model/request_profile';
import { Workflow } from 'src/app/model/workflow';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  constructor() {}
  skills: Request_Skill[] = [new Request_Skill('SWAT'), new Request_Skill('SEED')];
  states: Request_State[] = [new Request_State('Open'), new Request_State('Closed')];
  statesCsl: Request_State_Csl[] = [new Request_State_Csl('Requested'), new Request_State_Csl('Fulfilled')];
  projects: Request_Project[] = [new Request_Project('XPO'), new Request_Project('Portal do Cidadão')];
  profiles: Request_Profile[] = [new Request_Profile('Dev. Mobile'), new Request_Profile('Tester')];
  workflows: Workflow[] = [new Workflow('Developer'), new Workflow('Recruitment Team')];

  createRequest: Create_Request = new Create_Request(
    'Testing Description', 
    this.skills,
    this.states,
    this.statesCsl,
    this.projects,
    this.profiles,
    this.workflows)
  ngOnInit(): void {
  }


}
