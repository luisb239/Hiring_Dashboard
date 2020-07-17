import {Candidate} from '../../model/candidate/candidate';
import {Request} from '../../model/request/request';
import {Process} from '../../model/process/process';

export class CandidateDetailsProps {
  candidateId: number;
  requestId: number;
  candidate: Candidate;
  currentRequest: Request;
  currentProcess: Process;
  profiles: string[];
  allProcesses: Process[] = [];
  allRequests: Request[] = [];
}
