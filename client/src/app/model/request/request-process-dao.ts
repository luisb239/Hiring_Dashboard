import {ProcessCandidateDao} from '../process/process-candidate-dao';

export class RequestProcessDao {
  candidate: ProcessCandidateDao;
  phase: string;
  status: string;
  timestamp: string;
}
