import { RequestDetailsDao } from './request-details-dao';
import { UserRoleDao } from '../user/user-role-dao';
import { ProcessListDao } from '../process/process-list-dao';
import { RequestLanguageDao } from './request-language-dao';

export class RequestDao {
    request: RequestDetailsDao;
    userRoles: UserRoleDao[];
    processes: ProcessListDao[];
    languages: RequestLanguageDao[];
}
