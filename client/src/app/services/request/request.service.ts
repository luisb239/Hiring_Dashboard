import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {RequestDao} from '../../model/dao/request-dao';
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
export class RequestService {
  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  baseUrl = `http://localhost:8080/hd`;

  getRequestsByUser(userId: number, roleId: number) {
    return this.http.get<RequestDao[]>(`${this.baseUrl}/users/${userId}/roles/${roleId}/requests`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  getAllRequests() {
    return this.http.get<RequestDao[]>(`${this.baseUrl}/requests`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }
}
