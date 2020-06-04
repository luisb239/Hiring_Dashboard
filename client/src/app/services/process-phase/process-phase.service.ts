import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ErrorHandler} from '../error-handler';
import {CandidatesDao} from '../../model/dao/candidates-dao';
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

  baseUrl = `http://localhost:8080/hd`;

  updateProcessPhase(requestId: number, candidateId: number, newPhase: string) {
    return this.http.put(`${this.baseUrl}/requests/${requestId}/candidates/${candidateId}/requests`,
      {newPhase},
      httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }
}
