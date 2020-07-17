import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';
import {RequestProcessesDao} from '../../model/request/request-processes-dao';
import {ProcessDao} from '../../model/process/process-dao';
import {UnavailableReasonsDao} from '../../model/process/unavailable-reasons-dao';
import {StatusListDao} from '../../model/process/status-dao';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  baseUrl = `/hd`;

  getProcessesByRequest(requestId: number) {
    return this.http.get<RequestProcessesDao>(`${this.baseUrl}/requests/${requestId}/processes`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(data => data, catchError(this.errorHandler.handleError));
  }

  getProcess(requestId: number, candidateId: number) {
    return this.http.get<ProcessDao>(`${this.baseUrl}/requests/${requestId}/candidates/${candidateId}/process`,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      })
      .pipe(data => data, catchError(this.errorHandler.handleError));
  }

  createProcess(requestId: number, candidateId: number) {
    return this.http.post(`${this.baseUrl}/requests/${requestId}/candidates/${candidateId}/process`,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      })
      .pipe(data => data, catchError(this.errorHandler.handleError));
  }

  updateProcess(requestId: number, candidateId: number, body: any) {
    return this.http.put(`${this.baseUrl}/requests/${requestId}/candidates/${candidateId}/process`, body,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      })
      .pipe(data => data, catchError(this.errorHandler.handleError));
  }

  getReasons() {
    return this.http.get<UnavailableReasonsDao>(`${this.baseUrl}/process/reasons`,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      })
      .pipe(data => data, catchError(this.errorHandler.handleError));
  }

  getStatus() {
    return this.http.get<StatusListDao>(`${this.baseUrl}/process/status`,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      })
      .pipe(data => data, catchError(this.errorHandler.handleError));
  }
}
