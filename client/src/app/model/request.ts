import {Workflow} from './workflow';

export class Request {
  constructor(public workflow: number, public progress: number, public state: number) {
  }
}
