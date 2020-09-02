import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Session} from '../../model/session/session';
import {Role} from 'src/app/model/user/user';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = `/hd/auth`;
  public azureAuthenticationUrl = `${this.authUrl}/azure`;
  private authSession = `${this.authUrl}/session`;
  private logoutUrl = `${this.authUrl}/logout`;

  public userId: BehaviorSubject<number>;
  public userRoles: BehaviorSubject<Role[]>;

  public genericRoute = '/all-requests';

  constructor(private http: HttpClient) {
    this.userRoles = new BehaviorSubject<Role[]>([]);
    this.userId = new BehaviorSubject<number>(null);
  }

  resetUserInfo() {
    this.userId.next(null);
    this.userRoles.next([]);
  }

  public get currentUserRoles(): Role[] {
    return this.userRoles.value;
  }

  public get currentUserId(): number {
    return this.userId.value;
  }

  // Get current session
  getSession(): Observable<Session> {
    return this.http.get<Session>(this.authSession, httpOptions);
  }

  // Logout current user
  logout() {
    return this.http.post<Session>(this.logoutUrl, null);
  }

  isAdmin() {
    return this.currentUserRoles.find(r => r.role.toLowerCase() === 'admin');
  }

  isRecruiter() {
    return this.isAdmin() || this.currentUserRoles.find(r => r.role.toLowerCase() === 'recruiter');
  }

  isJobOwner() {
    return this.isAdmin() || this.currentUserRoles.find(r => r.role.toLowerCase() === 'jobowner');
  }

  isTeamLeader() {
    return this.isAdmin() || this.currentUserRoles.find(r => r.role.toLowerCase() === 'teamleader');
  }

}


