import {Phase} from './phase';
import {RequestList} from './request-list';

export class Workflow {
  // constructor(public workflow: string, public phases: Phase[] = [], public requests: Request[] = []) {
  // }
  constructor(public workflow: string, public requests: RequestList[] = [], public phases: Phase[] = []) {
  }
}
