import {RequestList} from '../../model/request/request-list';
import {Options} from 'ng5-slider';

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
  state: string;
  stateCsl: string;
  skill: string;
  profile: string;
  project: string;
  workflow: string;
  targetDate: string;
  quantity: number;
  progress: number;
}
