import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpUrlEncodingCodec} from '@angular/common/http';
import {ErrorHandler} from '../error-handler';
import {catchError} from 'rxjs/operators';
import {PhaseDao} from '../../model/dao/phase-dao';
import {PhasesDao} from '../../model/dao/phases-dao';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PhaseService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  baseUrl = `http://localhost:8080/hd`;

  getPhasesByWorkflow(workflowName: string) {
    const url = new HttpUrlEncodingCodec().encodeValue(workflowName);
    return this.http.get<PhasesDao>(`${this.baseUrl}/workflows/${url}/phases`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  getPhase(phaseName: string) {
    const url = new HttpUrlEncodingCodec().encodeValue(phaseName);
    return this.http.get<PhaseDao>(`${this.baseUrl}/phases/${url}`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }
}
