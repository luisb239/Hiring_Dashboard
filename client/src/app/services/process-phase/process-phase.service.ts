import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ErrorHandler} from '../error-handler';
import {catchError} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProcessPhaseService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  baseUrl = `/hd`;

  updateProcessPhase(requestId: number, candidateId: number, newPhase: string) {
    return this.http.put(`${this.baseUrl}/requests/${requestId}/candidates/${candidateId}/process`,
      {newPhase},
      httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  updateProcessPhaseNotes(requestId: number, candidateId: number, phase: string, notes: string) {
    return this.http.put(`${this.baseUrl}/requests/${requestId}/candidates/${candidateId}/process/phases/${phase}`,
      {notes},
      httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }
}
