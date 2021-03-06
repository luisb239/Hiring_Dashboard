import {ProcessPhaseDetailsDao} from './process-phase-details-dao';

export class ProcessDao {
  status: string;
  unavailableReason: string;
  currentPhase: string;
  timestamp: string;
  phases: ProcessPhaseDetailsDao[];
}
