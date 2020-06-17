import { RequestDetailsDao } from './request-details-dao';
import { UserRoleDao } from '../user/user-role-dao';
import { ProcessListDao } from '../process/process-list-dao';
import { LanguagesDao } from '../requestProps/languages-dao';

export class RequestDao {
    request: RequestDetailsDao;
    userRoles: UserRoleDao[];
    processes: ProcessListDao[];
    languages: LanguagesDao;
}
