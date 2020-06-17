import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';
import {SuccessPostDao} from '../../model/common/successPost-dao';
import {RequestDao} from 'src/app/model/request/request-dao';
import {RequestsDao} from 'src/app/model/request/requests-dao';
import {RequestDetailsDao} from 'src/app/model/request/request-details-dao';

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

/**
 * This class supplies all the functions needed to manage requests.
 */
export class RequestService {
  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  baseUrl = `http://localhost:8080/hd`;

  /**
   * This function queries the server for a specific request's details.
   * @param requestId is used to get a specific request' details.
   */
  getRequest(requestId: number) {
    return this.http.get<RequestDao>(`${this.baseUrl}/requests/${requestId}`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  /**
   *  This function queries the server for all the requests associated with a user-role.
   * @param userId is used to specify a user's requests.
   * @param roleId is used to specify a role's requests.
   */
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

  /**
   * This function queries the server for all the existing requests in the system.
   */
  getAllRequests() {
    return this.http.get<RequestsDao>(`${this.baseUrl}/requests`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  /**
   * This function queries the server for all the existing requests, with the possibility to filter the
   * response.
   * @param parameters are used to filter the values that are retrieved from the database.
   */
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

  /**
   * This function creates a request in the database with the values passed in requestBody.
   * @param requestBody is used to insert a new request in the database.
   */
  createRequest(requestBody) {
    const body = new RequestDetailsDao(requestBody.description,
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
