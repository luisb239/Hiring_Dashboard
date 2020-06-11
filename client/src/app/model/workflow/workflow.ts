import { Phase } from '../phase/phase';
import { RequestList } from '../request/request-list';

export class Workflow {
  constructor(public workflow: string, public requests: RequestList[] = [], public phases: Phase[] = []) {
  }
}
