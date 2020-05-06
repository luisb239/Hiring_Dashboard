import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {RequestDao} from '../model/dao/request-dao';
import {throwError} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  // mode: 'no-cors'
};

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  constructor(private http: HttpClient) { }

  baseUrl = `http://localhost:8080/hd`;

  requestsUrl = `${this.baseUrl}/requests`;

  getRequests() {
    return this.http.get<RequestDao[]>(this.requestsUrl, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.handleError));
  }

  // angular documentation error handling example -> needs to be updated
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
