import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
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

  constructor(private http: HttpClient) {
  }

  // Get current session
  getSession(): Observable<Session> {
    return this.http.get<Session>(this.authSession, httpOptions);
  }

  // Logout current user
  logout() {
    return this.http.post<Session>(this.logoutUrl, null);
  }

  // Save session auth in session storage
  setSessionInStorage(auth: boolean) {
    localStorage.setItem(this.authKey, String(auth));
  }

  // Get session auth from session storage
  getSessionFromStorage(): boolean {
    return Boolean(localStorage.getItem(this.authKey));
  }

  // Clear session auth
  clearSessionFromStorage() {
    localStorage.removeItem(this.authKey);
  }

}


