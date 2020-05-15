import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ErrorHandler } from '../error-handler';
// import { RequestStateDao } from '../../model/dao/requestProps-dao/state-dao'
// import { RequestStateCslDao } from '../../model/dao/requestProps-dao/stateCsl-dao'
import { RequestProfileDao } from '../../model/dao/requestProps-dao/profile-dao'
import { RequestProjectDao } from '../../model/dao/requestProps-dao/project-dao'
import { RequestLanguageDao } from '../../model/dao/requestProps-dao/language-dao'
import { RequestSkillDao } from '../../model/dao/requestProps-dao/skill-dao'
import { RequestTargetDateDao } from '../../model/dao/requestProps-dao/targetDate-dao'
import {RequestStateCslDao} from '../../model/dao/requestProps-dao/stateCsl-dao';
import {RequestStateDao} from '../../model/dao/requestProps-dao/state-dao';

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
    return this.http.get<RequestStateDao>(`${this.baseUrl}/states`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  getRequestStatesCsl() {
    return this.http.get<RequestStateCslDao>(`${this.baseUrl}/states-csl`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  getRequestProfiles() {
    return this.http.get<RequestProfileDao>(`${this.baseUrl}/profiles`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  getRequestProjects() {
    return this.http.get<RequestProjectDao>(`${this.baseUrl}/projects`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  getRequestSkills() {
    return this.http.get<RequestSkillDao>(`${this.baseUrl}/skills`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  getRequestLanguages() {
    return this.http.get<RequestLanguageDao>(`${this.baseUrl}/languages`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  getTargetDates() {
    return this.http.get<RequestTargetDateDao>(`${this.baseUrl}/months`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

}
