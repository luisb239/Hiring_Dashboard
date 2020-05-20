import {Candidate} from './candidate';

export class Phase {
  constructor(public name: string, public candidates: Candidate[] = []) {
  }
}
