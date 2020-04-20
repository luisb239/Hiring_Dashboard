import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {User} from "../model/user";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  //mode: 'no-cors'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // We can also add UserService instead of HttpClient, the UserService
  // would be responsible for creating and managing users (create/get)
  constructor(private http: HttpClient) {
  }

  authUrl:string = `http://localhost:8080/hd/auth`;

  registerUrl:string = `${this.authUrl}/sign_up`;
  loginUrl:string = `${this.authUrl}/login`;
  logoutUrl:string = `${this.authUrl}/logout`


  // We can call also call GET '/session' api endpoint
  isAuthenticated(): Boolean {
    return (this.getUserInfo())
  }


  getUserInfo() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  setUserInfo(user) {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  login(username: string, password: string) {
    return this.http.post<User>(this.loginUrl, {'username': username, 'password': password}, )
      .pipe(data => {
          return data;
        },
        catchError(this.handleError))
  }

  register(username: string, password: string) {
    return this.http.post<User>(this.registerUrl, {'username': username, 'password': password}, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.handleError))
  }

  // angular documentation error handling example -> needs to be updated
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}


