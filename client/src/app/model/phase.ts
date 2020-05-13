import {Candidate} from './candidate';

export class Phase {
  // constructor(public name: string, attributes: string) {
  // }
  constructor(public name: string, attributes: string, public candidates: Candidate[] = []) {
  }
}
