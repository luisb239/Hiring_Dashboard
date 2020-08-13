import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {UsersDao} from '../../model/user/user-dao';
import {RoleDao} from '../../model/role/role-dao';
import {Role} from 'src/app/model/user/user';

@Injectable({
  providedIn: 'root'
})

/**
 * This class supplies all the functions needed to manage users.
 */
export class UserService {
  constructor(private http: HttpClient) {
  }

  baseUrl = `/hd`;
  userRoles: Role[];

  /**
   * This function retrieves all the recruiters from the database.
   */
  getAllUsers(roleId: number) {
    let params = new HttpParams();
    params = params.set('roleId', String(roleId));
    return this.http.get<UsersDao>(`${this.baseUrl}/users`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), params
    });
  }

  getRoleIdByName(role: string) {
    let params = new HttpParams();
    params = params.set('role', role);
    return this.http.get<RoleDao>(`${this.baseUrl}/roles`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), params
    });
  }
}
