import {ProcessPhase} from './process-phase';

export class Process {
  constructor(public status: string,
              public unavailableReason: string,
              public timestamp: string,
              public phases: ProcessPhase[] = []) {
  }
}
