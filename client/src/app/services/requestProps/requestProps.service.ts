import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';
import { StatesDao } from 'src/app/model/requestProps/state-dao';
import { StatesCslDao } from 'src/app/model/requestProps/statesCsl-dao';
import { ProfilesDao } from 'src/app/model/requestProps/profiles-dao';
import { ProjectsDao } from 'src/app/model/requestProps/project-dao';
import { SkillsDao } from 'src/app/model/requestProps/skills-dao';
import { LanguagesDao } from 'src/app/model/requestProps/language-dao';
import { TargetDatesDao } from 'src/app/model/requestProps/targetDates-dao';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

@Injectable({
  providedIn: 'root'
})

/**
 * This class supplies all the functions needed to manage request's properties.
 */
export class RequestPropsService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  baseUrl = `http://localhost:8080/hd/requests-properties`;

  /**
   * This function queries the server for all the existing states in the system.
   */
  getRequestStates() {
    return this.http.get<StatesDao>(`${this.baseUrl}/states`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  /**
   * This function queries the server for all the existing statesCsl in the system.
   */
  getRequestStatesCsl() {
    return this.http.get<StatesCslDao>(`${this.baseUrl}/states-csl`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  /**
   * This function queries the server for all the existing profiles in the system.
   */
  getRequestProfiles() {
    return this.http.get<ProfilesDao>(`${this.baseUrl}/profiles`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  /**
   * This function queries the server for all the existing projects in the system.
   */
  getRequestProjects() {
    return this.http.get<ProjectsDao>(`${this.baseUrl}/projects`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  /**
   * This function queries the server for all the existing skills in the system.
   */
  getRequestSkills() {
    return this.http.get<SkillsDao>(`${this.baseUrl}/skills`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  /**
   * This function queries the server for all the existing languages in the system.
   */
  getRequestLanguages() {
    return this.http.get<LanguagesDao>(`${this.baseUrl}/languages`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  /**
   * This function queries the server for all the existing targetDates / months.
   */
  getTargetDates() {
    return this.http.get<TargetDatesDao>(`${this.baseUrl}/months`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

}
