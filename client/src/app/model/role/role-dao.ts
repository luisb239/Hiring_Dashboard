export class RoleDao {
  constructor(public id: number,
              public role: string,
              public parent_role: number) {
  }
}
