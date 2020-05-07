import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ErrorHandler } from '../error-handler';
import { RequestPropsDao } from 'src/app/model/dao/requestProps-dao';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class RequestPropsService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) { }

  baseUrl = `http://localhost:8080/hd/requests-properties`;

  getRequestStates() {
    return this.http.get<RequestPropsDao[]>(`${this.baseUrl}/states`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  getRequestStatesCsl() {
    return this.http.get<RequestPropsDao[]>(`${this.baseUrl}/states-csl`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  getRequestProfiles() {
    return this.http.get<RequestPropsDao[]>(`${this.baseUrl}/profiles`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  getRequestProjects() {
    return this.http.get<RequestPropsDao[]>(`${this.baseUrl}/projects`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  getRequestSkills() {
    return this.http.get<RequestPropsDao[]>(`${this.baseUrl}/skills`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  getRequestLanguages() {
    return this.http.get<RequestPropsDao[]>(`${this.baseUrl}/languages`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }
}
