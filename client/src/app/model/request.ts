import {Workflow} from './workflow';

export class Request {
  constructor(public workflow: string, public progress: number, public state: number) {
  }
}
