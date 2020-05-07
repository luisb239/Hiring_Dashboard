import {Candidate} from './candidate';

export class Column {
  constructor(public name: string, public candidates: Candidate[], public hidden: boolean = false) {}
}
