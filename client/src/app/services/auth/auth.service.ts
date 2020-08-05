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

  // store the URL so we can redirect after logging in
  redirectUrl: string;
  private authUrl = `/hd/auth`;
  public azureAuthenticationUrl = `${this.authUrl}/azure`;
  private authSession = `${this.authUrl}/session`;
  private sessionInfo = `${this.authSession}/info`;
  private logoutUrl = `${this.authUrl}/logout`;
  private authKey = 'auth';

  constructor(private http: HttpClient,
              private router: Router,
              private errorHandler: ErrorHandler) {
  }

  // Get current session
  getSession(): Observable<Session> {
    return this.http.get<Session>(this.authSession, httpOptions)
      .pipe(catchError(this.errorHandler.handleError));
  }

  // Logout current user
  logout() {
    return this.http.post<Session>(this.logoutUrl, null)
      .pipe(catchError(this.errorHandler.handleError));
  }

  // Save session auth in session storage
  setSessionInStorage(auth: boolean) {
    localStorage.setItem(this.authKey, String(auth));
  }

  // Get session auth from session storage
  getSessionFromStorage(): boolean {
    console.log(`Get session from storage -> service...`);
    console.log('key -> ' + localStorage.getItem(this.authKey));
    return Boolean(localStorage.getItem(this.authKey));
  }

  // Clear session auth
  clearSessionFromStorage() {
    localStorage.removeItem(this.authKey);
  }

}


