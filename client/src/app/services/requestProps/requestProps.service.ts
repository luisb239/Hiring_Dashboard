import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';
import { RequestStateDao } from 'src/app/model/requestProps/state-dao';
import { RequestStateCslDao } from 'src/app/model/requestProps/stateCsl-dao';
import { RequestProfileDao } from 'src/app/model/requestProps/profile-dao';
import { RequestProjectDao } from 'src/app/model/requestProps/project-dao';
import { RequestSkillDao } from 'src/app/model/requestProps/skill-dao';
import { RequestLanguageDao } from 'src/app/model/requestProps/language-dao';
import { RequestTargetDateDao } from 'src/app/model/requestProps/targetDate-dao';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class RequestPropsService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

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
