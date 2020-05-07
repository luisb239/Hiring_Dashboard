import {RequestSkill} from './request-skill';
import {RequestProfile} from './request-profile';
import {RequestProject} from './request-project';
import {RequestState} from './request-state';
import {RequestStateCsl} from './request-state-csl';
import {Workflow} from './workflow';

export class Create_Request {
  // constructor(public name: string, public requests: Request[]) {}
  constructor(
      public description: string,
      public skills: RequestSkill[],
      public states: RequestState[],
      public statesCsl: RequestStateCsl[],
      public projects: RequestProject[],
      public profiles: RequestProfile[],
      public workflows: Workflow[]){}
}
