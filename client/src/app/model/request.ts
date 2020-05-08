import {Phase} from './phase';

export class Request {
  constructor(public id: number,
              public workflow: string,
              public progress: number,
              public state: number,
              public description: string,
              public phases: Phase[] = []) {
  }
}
