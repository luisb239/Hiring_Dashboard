import {Workflow} from '../../model/workflow/workflow';
import {RequestList} from '../../model/request/request-list';
import {Content} from './content';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';

export class BoardProps {
  workflows: Workflow[] = [];
  requests: RequestList[] = [];
  content: Content;
  filteredOptions: Observable<string[]>;
  control = new FormControl();
  allRequests: string[];
  allWorkflows: string[];
  timestamp: Date;
}
