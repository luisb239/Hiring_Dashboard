import { RequestListDao } from './request-list-dao';
import { UserRoleDao } from '../user/user-role-dao';
import { ProcessListDao } from '../process/process-list-dao';
import { LanguageListDao } from '../requestProps/language-list-dao';

export class RequestDao {
    request: RequestListDao;
    userRoles: UserRoleDao[];
    processes: ProcessListDao[];
    languages: LanguageListDao[];
}
