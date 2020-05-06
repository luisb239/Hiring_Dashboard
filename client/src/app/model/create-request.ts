import {Request_Skill} from './request_skill';
import {Request_Profile} from './request_profile';
import {Request_Project} from './request_project';
import {Request_State} from './request_state';
import {Request_State_Csl} from './request_state_csl';
import {Workflow} from './workflow';

export class Create_Request {
  // constructor(public name: string, public requests: Request[]) {}
  constructor(
      public description: string, 
      public skills: Request_Skill[],
      public states: Request_State[],
      public statesCsl: Request_State_Csl[],
      public projects: Request_Project[],
      public profiles: Request_Profile[],
      public workflows: Workflow[]){}
}
