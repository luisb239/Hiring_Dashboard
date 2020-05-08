import {Phase} from './phase';

export class Workflow {
  constructor(public _workflow: string, public phases: Phase[]) {
  }
}
