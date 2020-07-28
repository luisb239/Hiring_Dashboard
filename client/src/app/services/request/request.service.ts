import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';
import {SuccessPostDao} from '../../model/common/successPost-dao';
import {RequestDao} from 'src/app/model/request/request-dao';
import {RequestsDao} from 'src/app/model/request/requests-dao';

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

  baseUrl = `/hd`;

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
    console.log(parameters);
    let params = new HttpParams();
    singleParams.forEach(p => {
      if (parameters[p] !== null && parameters[p] !== '') {
        params = params.set(p, parameters[p]);
      }
    });

    if (parameters.progress[0]) {
      params = params.set('minProgress', String(parameters.progress[0]));
    }
    if (parameters.progress[1]) {
      params = params.set('maxProgress', String(parameters.progress[1]));
    }
    if (parameters.quantity[0]) {
      params = params.set('minQuantity', String(parameters.quantity[0]));
    }
    if (parameters.quantity[1]) {
      params = params.set('maxQuantity', String(parameters.quantity[1]));
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
    return this.http.post<SuccessPostDao>(`${this.baseUrl}/requests`, requestBody, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  /**
   * This function adds a user with the id userId to the request with the id requestId in the database.
   * @param requestId is used to specify a request.
   * @param userId is used to specify a user.
   * @param role is used to specify a role.
   */
  addUser(requestId: number, userId: number, role: string) {
    return this.http.post<SuccessPostDao>(`${this.baseUrl}/requests/${requestId}/users`, {userId, role}, httpOptions)
      .pipe(data => {
        return data;
      },
      catchError(this.errorHandler.handleError));
  }
}
