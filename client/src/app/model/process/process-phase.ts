import {PhaseInfo} from '../phase/phase-info';

export class ProcessPhase {
  constructor(public phase: string,
              public startDate: string,
              public updateDate: string,
              public notes: string,
              public infos: PhaseInfo[] = []
  ) {
  }
}
