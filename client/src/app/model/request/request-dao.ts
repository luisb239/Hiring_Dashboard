import {RequestDetailsDao} from './request-details-dao';
import {UserRoleDao} from '../user/user-role-dao';
import {RequestLanguageDao} from './request-language-dao';
import {RequestProcessDao} from './request-process-dao';

export class RequestDao {
  request: RequestDetailsDao;
  userRoles: UserRoleDao[];
  processes: RequestProcessDao[];
  languages: RequestLanguageDao[];
}
