import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {RequestDao} from '../../model/dao/request-dao';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  // mode: 'no-cors'
};

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  baseUrl = `http://localhost:8080/hd`;

  getCandidatesByRequestPhaseUrl = `${this.baseUrl}/requests/1/phases/First%20Interview/candidates`;

  getCandidatesByRequestPhase() {
    return this.http.get<RequestDao[]>(this.getCandidatesByRequestPhaseUrl, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }
}
