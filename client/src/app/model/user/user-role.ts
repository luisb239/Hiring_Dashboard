export class UserRole {
  constructor(
    public userId: number,
    public email: string = '',
    public roleId: number,
    public role: string = '') {
  }
}
