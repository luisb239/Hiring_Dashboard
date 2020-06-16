import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';
import {SuccessPostDao} from '../../model/common/successPost-dao';
import {RequestDao} from 'src/app/model/request/request-dao';
import {RequestsDao} from 'src/app/model/request/requests-dao';
import {RequestListDao} from 'src/app/model/request/request-list-dao';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
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

  getRequest(requestId: number) {
    return this.http.get<RequestDao>(`${this.baseUrl}/requests/${requestId}`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  getRequestsByUser(userId: number, roleId: number) {
    const params = new HttpParams()
      .set('userId', String(userId))
      .set('roleId', String(roleId));
    return this.http.get<RequestsDao>(`${this.baseUrl}/requests`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }), params
      })
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

  getAllRequestsWithQuery(parameters: any) {
    let params = new HttpParams();
    singleParams.forEach(p => {
      if (parameters[p] !== '') {
        params = params.set(p, parameters[p]);
      }
    });

    if (parameters.progress[0]) {
      params = params.set('minProgress', String(parameters.progress[0]));
    }
    if (parameters.progress[1]) {
      params = params.set('minProgress', String(parameters.progress[1]));
    }
    if (parameters.quantity[0]) {
      params = params.set('minProgress', String(parameters.quantity[0]));
    }
    if (parameters.quantity[1]) {
      params = params.set('minProgress', String(parameters.quantity[1]));
    }

    console.log(params.toString());
    return this.http.get<RequestsDao>(`${this.baseUrl}/requests`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), params
    })
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  createRequest(requestBody) {
    const body = new RequestListDao(requestBody.description,
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
