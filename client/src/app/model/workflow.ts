import {Phase} from './phase';

export class Workflow {
  constructor(public workflow: string, public phases: Phase[]) {
  }
}
