import { Role } from '../user/user';

export class Session {
  constructor(public auth: boolean,
              public userId: number,
              public userRoles: Role[]) {
  }
}
