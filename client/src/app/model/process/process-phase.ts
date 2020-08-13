import {PhaseInfo} from '../phase/phase-info';

export class ProcessPhase {
  constructor(public phase: string,
              public notes: string,
              public infos: PhaseInfo[] = []
  ) {
  }
}
