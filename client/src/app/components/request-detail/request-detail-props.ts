import {RequestList} from 'src/app/model/request/request-list';
import {UserRole} from 'src/app/model/user/user-role';
import {ProcessList} from 'src/app/model/process/process-list';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {User} from '../../model/user/user';
import {LanguageCheckbox} from '../../model/requestProps/language-checkbox';

export class RequestDetailProps {
  requestId: number;
  requestList: RequestList;
  userRoles: UserRole[];
  mandatoryLanguages: LanguageCheckbox[];
  valuedLanguages: LanguageCheckbox[];
  processes: ProcessList[];
  requestAttrs: string[];
  userForm: FormGroup;
  users: User[];
  skills: string[];
  profiles: string[];
  projects: string[];
  targetDates: string[];
  languages: string[];
  states: string[];
  statesCsl: string[];

  updateForm: FormGroup;

  timestamp: Date;
}
