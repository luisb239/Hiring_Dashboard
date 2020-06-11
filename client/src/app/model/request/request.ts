import { UserRole } from '../user/user-role';
import { RequestList } from './request-list';
import { ProcessList } from '../process/process-list';
import { LanguageList } from '../requestProps/language-list';

export class Request {
    constructor(
        public request: RequestList,
        public userRoles: UserRole[] = [],
        public candidates: ProcessList[] = [],
        public languages: LanguageList[] = []
    ) { }
}
