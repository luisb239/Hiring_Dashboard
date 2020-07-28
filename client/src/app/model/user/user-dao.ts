export class UserDao {
  id: number;
  username: string;
  created_at: string;
  last_sign_in: string;
  is_active: boolean;
}

export class UsersDao {
  users: UserDao[];
}
