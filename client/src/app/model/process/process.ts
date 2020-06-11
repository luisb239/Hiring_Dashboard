import {ProcessPhase} from './process-phase';

export class Process {
  constructor(public status: string,
              public unavailableReason: string,
              public phases: ProcessPhase[] = []) {
  }
}
