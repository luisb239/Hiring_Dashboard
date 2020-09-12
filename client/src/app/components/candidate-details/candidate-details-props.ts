import {Candidate} from '../../model/candidate/candidate';
import {FormControl, FormGroup} from '@angular/forms';

export class CandidateDetailsProps {
  candidateId: number;
  requestId: number;
  candidate: Candidate;
  profiles: string[];
  allProcesses: any = {};
  allProcessesKeys: string[] = [];
  allRequests: any = {};
  fileToUpload: File = null;
  updateForm: FormGroup;
  infoForm: FormControl;
  profilesForm: FormControl;
  newCandidate: Candidate;
}
