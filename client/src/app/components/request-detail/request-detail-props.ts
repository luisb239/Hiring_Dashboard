import {RequestList} from 'src/app/model/request/request-list';
import {UserRole} from 'src/app/model/user/user-role';
import {ProcessList} from 'src/app/model/process/process-list';
import {FormGroup} from '@angular/forms';
import {User} from '../../model/user/user';
import {EventEmitter, Output} from '@angular/core';

export class RequestDetailProps {
  requestId: number;
  requestList: RequestList;
  userRoles: UserRole[];
  mandatoryLanguages: string;
  valuedLanguages: string;
  processes: ProcessList[];
  requestAttrs: string[];
  userForm: FormGroup;
  users: User[];
}
