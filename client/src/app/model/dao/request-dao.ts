import { RequestListDao } from './request-list-dao';
import { CandidateDao } from './candidate-dao';
import { UserRoleDao } from './user-role-dao';

export class RequestDao {
    request: RequestListDao;
    userRoles: UserRoleDao[];
    candidates: CandidateDao[];
}
