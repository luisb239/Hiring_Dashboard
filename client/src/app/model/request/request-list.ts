import {Phase} from '../phase/phase';

export class RequestList {
  constructor(public id: number,
              public workflow: string,
              public progress: number,
              public state: string,
              public description: string,
              public dateToSendProfile: string = '',
              public project: string = '',
              public quantity: number = 1,
              public requestDate: string = '',
              public skill: string = '',
              public stateCSL: string = '',
              public targetDate: string = '',
              public profile: string = '',
              public phases: Phase[] = []
  ) {
  }
}
