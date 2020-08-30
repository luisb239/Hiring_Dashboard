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

  public userId: BehaviorSubject<number>;
  public userRoles: BehaviorSubject<Role[]>;
  private authUrl = `/hd/auth`;
  public azureAuthenticationUrl = `${this.authUrl}/azure`;
  private authSession = `${this.authUrl}/session`;
  private logoutUrl = `${this.authUrl}/logout`;

  constructor(private http: HttpClient) {
    this.userRoles = new BehaviorSubject<Role[]>([]);
    this.userId = new BehaviorSubject<number>(null);
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

  isRecruiter() {
    return this.currentUserRoles.find(r => r.role.toLowerCase() === 'admin') ||
      this.currentUserRoles.find(r => r.role.toLowerCase() === 'recruiter');
  }

  isJobOwner() {
    return this.currentUserRoles.find(r => r.role.toLowerCase() === 'admin') ||
      this.currentUserRoles.find(r => r.role.toLowerCase() === 'jobowner');
  }

  isTeamLeader() {
    return this.currentUserRoles.find(r => r.role.toLowerCase() === 'admin') ||
      this.currentUserRoles.find(r => r.role.toLowerCase() === 'teamleader');
  }


}


