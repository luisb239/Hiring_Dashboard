import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {SuccessPostDao} from '../../model/common/successPost-dao';
import {RequestDao} from 'src/app/model/request/request-dao';
import {RequestsDao} from 'src/app/model/request/requests-dao';
import {RequestDetailsDao} from 'src/app/model/request/request-details-dao';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import {PaginationService} from '../../components/datasource/generic-data-source';

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
export class RequestService implements PaginationService {
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  baseUrl = `/hd`;

  private static getParams(args: any = {}): HttpParams {
    let params = new HttpParams();
    Object.keys(args).forEach(arg => {
      if (args[arg] !== null && args[arg] !== undefined) {
        params = params.set(arg, args[arg]);
      }
    });
    return params;
  }

  /**
   * This function queries the server for a specific request's details.
   * @param requestId is used to get a specific request' details.
   */
  getRequest(requestId: number) {
    return this.http.get<RequestDao>(`${this.baseUrl}/requests/${requestId}`, httpOptions);
  }

  find(pageNumber: number, pageSize: number, args: any): Observable<RequestDetailsDao[]> {
    const params = RequestService.getParams(args)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<RequestsDao>(`${this.baseUrl}/requests`, {
      params
    }).pipe(map(r => r.requests));
  }

  // count the number of requests with the filters applied..
  count(args: any = {}) {
    const params = RequestService.getParams(args);
    return this.http.get<any>(`${this.baseUrl}/requests/count`, {
      params
    });
  }

  /**
   *  This function queries the server for all the requests associated with a user.
   */
  getUserCurrentRequests() {
    let params = new HttpParams();
    // If user is admin or team Leader get all requests from server,
    // otherwise only retrieve the user associated requests
    if (!this.authService.currentUserRoles.find(r => r.role === 'admin' || r.role === 'teamLeader')) {
      params = params.set('currentUser', String(true));
    }
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
   * @param timestamp is used to specify the user's time of arrival
   */
  addUser(requestId: number, userId: number, roleId: number) {
    return this.http.post<SuccessPostDao>(`${this.baseUrl}/requests/${requestId}/users`,
      {userId, roleId}, httpOptions);
  }

  updateRequest(requestId: number, body: any) {
    return this.http.patch(`${this.baseUrl}/requests/${requestId}`, body, httpOptions);
  }

  deleteLanguageRequirementFromRequest(requestId: number, language: string, isMandatory: boolean): Observable<any> {
    const params = new HttpParams().append('isMandatory', String(isMandatory));
    return this.http.delete<SuccessPostDao>(`${this.baseUrl}/requests/${requestId}/languages/${language}`, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}), params
    });
  }

  addLanguageRequirementToRequest(requestId: number, language: string, isMandatory: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}/requests/${requestId}/languages`, {language, isMandatory});
  }

}
