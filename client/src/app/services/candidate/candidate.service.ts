import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpUrlEncodingCodec} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';
import {CandidatesDao} from '../../model/dao/candidates-dao';
import {CandidateDao} from '../../model/dao/candidate-dao';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  baseUrl = `http://localhost:8080/hd`;

  getCandidatesByRequestPhase(requestId: number, phaseName: string, currentPhase: boolean) {
    const url = new HttpUrlEncodingCodec().encodeValue(phaseName);
    return this.http.get<CandidatesDao>(`${this.baseUrl}/requests/${requestId}/phases/${url}/candidates`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: new HttpParams().set('in_current_phase', String(currentPhase))
    })
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  getCandidateById(candidateId: number) {
    return this.http.get<CandidateDao>(`${this.baseUrl}/candidates/${candidateId}`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }
}
