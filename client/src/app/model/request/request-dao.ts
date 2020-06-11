import { RequestListDao } from './request-list-dao';
import { UserRoleDao } from '../user/user-role-dao';
import { CandidateListDao } from '../candidate/candidate-list-dao';

export class RequestDao {
    request: RequestListDao;
    userRoles: UserRoleDao[];
    candidates: CandidateListDao[];
}
