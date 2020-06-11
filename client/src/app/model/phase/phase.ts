import {Candidate} from '../candidate/candidate';

export class Phase {
  constructor(public name: string, public candidates: Candidate[] = []) {
  }
}
