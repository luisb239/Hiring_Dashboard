import { RequestDetailsDao } from './request-details-dao';
import { UserRoleDao } from '../user/user-role-dao';
import { ProcessListDao } from '../process/process-list-dao';
import { LanguageListDao } from '../requestProps/language-list-dao';

export class RequestDao {
    request: RequestDetailsDao;
    userRoles: UserRoleDao[];
    processes: ProcessListDao[];
    languages: LanguageListDao[];
}
