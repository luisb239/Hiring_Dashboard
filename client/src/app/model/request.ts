import { Candidate } from './candidate';
import { UserRole } from './user-role';
import { RequestList } from './request-list';

export class Request {
    request: RequestList;
    userRoles: UserRole[];
    candidates: Candidate[];
    constructor(
        request: RequestList,
        userRoles: UserRole[],
        candidates: Candidate[]
    ) {
        this.request = request;
        this.userRoles = userRoles;
        this.candidates = candidates;
    }
}
