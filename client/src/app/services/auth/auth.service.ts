import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {UserDao} from '../../model/dao/user-dao';
import {ErrorHandler} from '../error-handler';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  // mode: 'no-cors'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // We can also add UserService instead of HttpClient, the UserService
  // would be responsible for creating and managing users (create/get)
  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  authUrl = `http://localhost:8080/hd/auth`;

  registerUrl = `${this.authUrl}/sign_up`;
  loginUrl = `${this.authUrl}/login`;
  logoutUrl = `${this.authUrl}/logout`;


  // We can call also call GET '/session' api endpoint
  isAuthenticated(): boolean {
    return (this.getUserInfo());
  }


  getUserInfo() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  setUserInfo(user) {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  login(username: string, password: string) {
    return this.http.post<UserDao>(this.loginUrl, {username, password},)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  register(username: string, password: string) {
    return this.http.post<UserDao>(this.registerUrl, {username, password}, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

}


