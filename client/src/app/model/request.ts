import {Phase} from './phase';

export class Request {
  constructor(public id: number,
              public workflow: string,
              public progress: number,
              public state: string,
              public description: string,
              public phases: Phase[] = [],
              public dateToSendProfile: string = '',
              public project: string = '',
              public quantity: number = 0,
              public requestDate: string = '',
              public skill: string = '',
              public stateCSL: string = '',
              public targetDate: string = '',
              public profile: string = ''
  ) {
  }
}
