import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Session} from '../../model/session/session';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // We can also add UserService instead of HttpClient, the UserService
  isAuthenticated: boolean;
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  userId: number;
  private authUrl = `/hd/auth`;
  public azureAuthenticationUrl = `${this.authUrl}/azure`;
  private authSession = `${this.authUrl}/session`;
  private sessionInfo = `${this.authSession}/info`;
  private logoutUrl = `${this.authUrl}/logout`;

  // would be responsible for creating and managing users (create/get)
  constructor(private http: HttpClient,
              private router: Router,
              private errorHandler: ErrorHandler) {
  }

  // Get current session
  getSession(): Observable<Session> {
    return this.http.get<Session>(this.authSession, httpOptions)
      .pipe(catchError(this.errorHandler.handleError));
  }

  logout() {
    return this.http.post<Session>(this.logoutUrl, null)
      .pipe(catchError(this.errorHandler.handleError));
  }
}


