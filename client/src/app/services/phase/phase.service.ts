import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ErrorHandler} from '../error-handler';
import {catchError} from 'rxjs/operators';
import {PhaseDao} from '../../model/dao/phase-dao';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  // mode: 'no-cors'
};

@Injectable({
  providedIn: 'root'
})
export class PhaseService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  baseUrl = `http://localhost:8080/hd`;

  getPhasesByWorkflow(workflowName: string) {
    return this.http.get<PhaseDao[]>(`${this.baseUrl}/workflows/${workflowName}/phases`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }
}
