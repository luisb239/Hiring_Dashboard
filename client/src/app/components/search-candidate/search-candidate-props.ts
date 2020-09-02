import {FormGroup} from '@angular/forms';
import {CandidateDetailsDao} from '../../model/candidate/candidate-details-dao';
import {GenericDataSource} from '../datasource/generic-data-source';

export class SearchCandidateProps {
  profiles: string[];
  filterForm: FormGroup;
  candidates: CandidateDetailsDao[];
  DEFAULT_PAGE_SIZE = 10;
  listSize: number;
  dataSource: GenericDataSource;
}
