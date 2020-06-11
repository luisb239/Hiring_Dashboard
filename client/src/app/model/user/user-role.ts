export class UserRole {
    constructor(
        public userId: number,
        public username: string = '',
        public roleId: number,
        public role: string = '') { }
}
