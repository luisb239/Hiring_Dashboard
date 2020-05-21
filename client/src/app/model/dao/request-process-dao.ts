import {ProcessCandidateDao} from './process-candidate-dao';
import {ProcessPhaseDao} from './process-phase-dao';

export class RequestProcessDao {
  candidate: ProcessCandidateDao;
  phases: ProcessPhaseDao[];
}
