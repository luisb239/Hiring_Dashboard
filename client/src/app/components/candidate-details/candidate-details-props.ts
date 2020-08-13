import {Candidate} from '../../model/candidate/candidate';
import {Request} from '../../model/request/request';
import {Process} from '../../model/process/process';
import {FormGroup, FormControl} from '@angular/forms';

export class CandidateDetailsProps {
  candidateId: number;
  requestId: number;
  candidate: Candidate;
  currentRequest: Request;
  currentProcess: Process;
  profiles: string[];
  allProcesses: Process[] = [];
  allRequests: Request[] = [];
  fileToUpload: File = null;
  updateForm: FormGroup;
  infoForm: FormControl;
  profilesForm: FormControl;
  timestamp: Date;
}
