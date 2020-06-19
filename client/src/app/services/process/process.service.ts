import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';
import {RequestProcessesDao} from '../../model/request/request-processes-dao';
import {ProcessDao} from '../../model/process/process-dao';

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

  updateProcess(requestId: number, candidateId: number, status: string, unavailableReason: string,
                phaseNotes: string, infos: any[]) {
    const body = {status, unavailableReason, phaseNotes, infos};
    return this.http.put(`${this.baseUrl}/requests/${requestId}/candidates/${candidateId}/process`, body,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      })
      .pipe(data => data, catchError(this.errorHandler.handleError));
  }
}
