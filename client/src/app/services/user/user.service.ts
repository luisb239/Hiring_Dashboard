import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ErrorHandler } from '../error-handler';
import { UsersDao } from '../../model/user/user-dao';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

/**
 * This class supplies all the functions needed to manage users.
 */
export class UserService {
  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  baseUrl = `/hd`;

  /**
   * This function retrieves all the recruiters from the database.
   */
  getAllRecruiters() {
    let params = new HttpParams();
    params = params.set('roleId', '3');
    return this.http.get<UsersDao>(`${this.baseUrl}/users`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), params
    })
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }
}
