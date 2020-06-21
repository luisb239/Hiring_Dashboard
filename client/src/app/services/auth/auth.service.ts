import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';

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
  // would be responsible for creating and managing users (create/get)
  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  authUrl = `/hd/auth`;

  azureAuthenticationUrl = `${this.authUrl}/azure`;
  authSession = `${this.authUrl}/session`;
  logoutUrl = `${this.authUrl}/logout`;

  registerUrl = 'test';

  // We can call also call GET '/session' api endpoint
  isAuthenticated(): boolean {
    return (this.getUserInfo() != null);
  }


  getUserInfo() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  setUserInfo(user) {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  getUserSession() {
    return this.http.get(this.authSession, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  authenticate() {
    return this.http.get(this.azureAuthenticationUrl, httpOptions)
      .pipe(data => data, catchError(this.errorHandler.handleError));
  }


}


