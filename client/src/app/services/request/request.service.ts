import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {RequestDao} from '../../model/dao/request-dao';
import {ErrorHandler} from '../error-handler';
import {RequestsDao} from '../../model/dao/requests-dao';
import {SuccessPostDao} from '../../model/dao/successPost-dao';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  // mode: 'no-cors'
};

const singleParams: string[] = ['skill', 'state', 'stateCsl', 'project', 'profile',
  'workflow', 'targetDate'];

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  baseUrl = `http://localhost:8080/hd`;

  getRequestsByUser(userId: number, roleId: number) {
    return this.http.get<RequestsDao>(`${this.baseUrl}/users/${userId}/roles/${roleId}/requests`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  getAllRequests() {
    return this.http.get<RequestsDao>(`${this.baseUrl}/requests`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  // getAllRequestsWithQuery(skill: string, state: string, stateCsl: string, project: string, profile: string,
  //                         workflow: string, targetDate: string, quantityMin: number, quantityMax: number,
  //                         progressMin: number, progressMax: number) {
  getAllRequestsWithQuery(parameters: any) {
    let parameterString = '';
    singleParams.forEach(p => {
      if (parameters[p] !== '') {
        parameterString += `${p}=${parameters[p]}&`;
      }
    });

    if (parameters.progress[0]) {
      parameterString += `min_progress=${parameters.progress[0]}&`;
    }
    if (parameters.progress[1]) {
      parameterString += `max_progress=${parameters.progress[1]}&`;
    }
    if (parameters.quantity[0]) {
      parameterString += `min_quantity=${parameters.quantity[0]}&`;
    }
    if (parameters.quantity[1]) {
      parameterString += `max_quantity=${parameters.quantity[1]}&`;
    }
    parameterString = parameterString.slice(0, -1);
    return this.http.get<RequestsDao>(`${this.baseUrl}/requests?${parameterString}`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  createRequest(requestBody) {
    const body = new RequestDao(requestBody.description,
      requestBody.project,
      requestBody.quantity,
      requestBody.skill,
      requestBody.stateCsl,
      requestBody.state,
      requestBody.targetDate,
      requestBody.workflow,
      requestBody.profile,
      requestBody.mandatoryLanguages,
      requestBody.valuedLanguages,
      requestBody.dateToSendProfile);
    return this.http.post<SuccessPostDao>(`${this.baseUrl}/requests`, body, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }
}
