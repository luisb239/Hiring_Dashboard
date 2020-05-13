import {Phase} from './phase';
import {Request} from './request';

export class Workflow {
  // constructor(public workflow: string, public phases: Phase[] = [], public requests: Request[] = []) {
  // }
  constructor(public workflow: string, public requests: Request[] = [], public phases: Phase[] = []) {
  }
}
