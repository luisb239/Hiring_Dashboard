import {ProcessPhaseDetailsDao} from './process-phase-details-dao';

export class ProcessDao {
  status: string;
  unavailableReasons: string;
  phases: ProcessPhaseDetailsDao[];
}
