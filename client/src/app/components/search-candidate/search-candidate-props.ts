import {FormGroup} from '@angular/forms';
import {CandidateDetailsDao} from '../../model/candidate/candidate-details-dao';

export class SearchCandidateProps {
  profiles: string[];
  filterForm: FormGroup;
  candidates: CandidateDetailsDao[];
}
