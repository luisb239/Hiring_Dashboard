import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';
import {RequestProcessesDao} from '../../model/dao/request-processes-dao';
import {ProcessDao} from '../../model/dao/process-dao';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json'
//   })
// };

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  baseUrl = `http://localhost:8080/hd`;

  getProcessesByRequest(requestId: number) {
    return this.http.get<RequestProcessesDao>(`${this.baseUrl}/requests/${requestId}/processes`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  getProcess(requestId: number, candidateId: number) {
    return this.http.get<ProcessDao>(`${this.baseUrl}/requests/${requestId}/candidates/${candidateId}/process`,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      })
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }
}
