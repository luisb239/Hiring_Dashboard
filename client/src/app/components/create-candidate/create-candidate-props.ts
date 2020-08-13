import {FormGroup} from '@angular/forms';

export class CreateCandidateProps {
  fileToUpload: File = null;
  candidateName = '';
  profiles: string[];
  createForm: FormGroup;
}
