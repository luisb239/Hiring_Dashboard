import {Workflow} from '../../model/workflow/workflow';
import {RequestList} from '../../model/request/request-list';

export class BoardProps {
  workflows: Workflow[] = [];
  requests: RequestList[] = [];
}
