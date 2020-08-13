import {Phase} from '../phase/phase';

export class RequestList {
  constructor(public id: number,
              public workflow: string,
              public progress: number,
              public state: string,
              public description: string,
              public quantity: number = 0,
              public dateToSendProfile: string = '',
              public project: string = '',
              public requestDate: string = '',
              public skill: string = '',
              public stateCSL: string = '',
              public targetDate: string = '',
              public profile: string = '',
              public phases: Phase[] = []
  ) {
  }

  public placedCandidates = 0;
  public hidden = false;
}
