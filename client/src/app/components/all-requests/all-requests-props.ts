import {RequestList} from '../../model/request/request-list';
import {Options} from 'ng5-slider';
import {GenericDataSource} from '../datasource/generic-data-source';
import {FormBuilder, FormGroup} from '@angular/forms';

export class AllRequestsProps {
  requests: RequestList[];
  states: string[];
  statesCsl: string[];
  skills: string[];
  profiles: string[];
  projects: string[];
  workflows: string[];
  targetDates: string[];
  minValueProgress = 0;
  maxValueProgress = 100;
  minValueQuantity = 1;
  maxValueQuantity = 10;
  optionsQuantity: Options = {
    floor: 1,
    ceil: 10
  };
  optionsProgress: Options = {
    floor: 0,
    ceil: 100,
    step: 25
  };

  requestId: number;
  dataSource: GenericDataSource;

  formGroup: FormGroup;
  formBuilder: FormBuilder;
  DEFAULT_PAGE_SIZE = 10;
  listSize: number;
}
