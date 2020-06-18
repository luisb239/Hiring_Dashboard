import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';
import {CandidateDao} from 'src/app/model/candidate/candidate-dao';
import { CandidatesDao } from 'src/app/model/candidate/candidates-dao';

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

  getCandidateById(candidateId: number) {
    return this.http.get<CandidateDao>(`${this.baseUrl}/candidates/${candidateId}`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  getAllCandidates() {
    return this.http.get<CandidatesDao>(`${this.baseUrl}/candidates`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }
}
