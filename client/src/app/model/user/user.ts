export class User {
  constructor(public userId: number,
              public userEmail: string,
              public roles: Role[]) {
  }
}

export class Role {
  constructor(public roleId: number,
              public role: string) {
  }
}
