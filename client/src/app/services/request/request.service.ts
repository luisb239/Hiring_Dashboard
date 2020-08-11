import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {SuccessPostDao} from '../../model/common/successPost-dao';
import {RequestDao} from 'src/app/model/request/request-dao';
import {RequestsDao} from 'src/app/model/request/requests-dao';
import {RequestDetailsDao} from 'src/app/model/request/request-details-dao';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

/**
 * This class supplies all the functions needed to manage requests.
 */
export class RequestService {
  constructor(private http: HttpClient) {
  }

  baseUrl = `/hd`;

  /**
   * This function queries the server for a specific request's details.
   * @param requestId is used to get a specific request' details.
   */
  getRequest(requestId: number) {
    return this.http.get<RequestDao>(`${this.baseUrl}/requests/${requestId}`, httpOptions);
  }

  find(
    pageNumber: number,
    pageSize: number,
    args: any
  ): Observable<RequestDetailsDao[]> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    Object.keys(args).forEach(arg => {
      if (args[arg] !== null && args[arg] !== undefined) {
        params = params.set(arg, args[arg]);
      }
    });

    return this.http.get<RequestsDao>(`${this.baseUrl}/requests`, {
      params
    }).pipe(map(r => r.requests));
  }

  /**
   *  This function queries the server for all the requests associated with a user-role.
   */
  getUserCurrentRequests() {
    const params = new HttpParams().set('currentUser', String(true));
    return this.http.get<RequestsDao>(`${this.baseUrl}/requests`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }), params
      });
  }

  /**
   * This function creates a request in the database with the values passed in requestBody.
   * @param requestBody is used to insert a new request in the database.
   */
  createRequest(requestBody) {
    return this.http.post<SuccessPostDao>(`${this.baseUrl}/requests`, requestBody, httpOptions);
  }

  /**
   * This function adds a user with the id userId to the request with the id requestId in the database.
   * @param requestId is used to specify a request.
   * @param userId is used to specify a user.
   * @param roleId is used to specify a role.
   */
  addUser(requestId: number, userId: number, roleId: number) {
    return this.http.post<SuccessPostDao>(`${this.baseUrl}/requests/${requestId}/users`,
      {userId, roleId}, httpOptions);
  }

  updateRequest(requestId: number, body: any) {
    return this.http.patch<SuccessPostDao>(`${this.baseUrl}/requests/${requestId}`, body, httpOptions);
  }

  deleteRequestLanguage(requestId: number, parameters: any) {
    let params = new HttpParams();
    Object.keys(parameters).forEach(p => {
      params = params.set(p, parameters[p]);
    });
    return this.http.delete<SuccessPostDao>(`${this.baseUrl}/requests/${requestId}/languages`, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}), params
    });
  }

  // count the number of requests with the filters applied..
  count(args: any) {

    let params = new HttpParams();

    Object.keys(args).forEach(arg => {
      if (args[arg]) {
        params = params.set(arg, args[arg]);
      }
    });

    return this.http.get<any>(`${this.baseUrl}/count`, {
      params
    });
  }

}
