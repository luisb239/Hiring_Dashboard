import { UserRole } from '../user/user-role';
import { RequestList } from './request-list';
import { CandidateList } from '../candidate/candidate-list';

export class Request {
    request: RequestList;
    userRoles: UserRole[];
    candidates: CandidateList[];
    constructor(
        request: RequestList,
        userRoles: UserRole[],
        candidates: CandidateList[]
    ) {
        this.request = request;
        this.userRoles = userRoles;
        this.candidates = candidates;
    }
}
