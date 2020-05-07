import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
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
  constructor(private http: HttpClient, private errorHandler: ErrorHandler) { }

  baseUrl = `http://localhost:8080/hd`;

  requestsByUserUrl = `${this.baseUrl}/users/1/roles/1/requests`;

  getRequestsByUser() {
    return this.http.get<RequestDao[]>(this.requestsByUserUrl, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }
}
