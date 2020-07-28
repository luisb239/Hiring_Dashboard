export class UserDao {
  id: number;
  email: string;
}

export class UsersDao {
  users: UserDao[];
}
