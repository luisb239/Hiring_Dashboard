import {ProcessPhaseDetailsDao} from './process-phase-details-dao';

export class ProcessDao {
  status: string;
  unavailableReasons: string;
  currentPhase: string;
  phases: ProcessPhaseDetailsDao[];
}
