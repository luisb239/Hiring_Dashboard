import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';
import {CandidateDao} from 'src/app/model/candidate/candidate-dao';
import {CandidatesDao} from '../../model/candidate/candidates-dao';
import {Candidate} from '../../model/candidate/candidate';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  baseUrl = `/hd`;

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

  getAllCandidatesWithQueries(profiles: string[], available: boolean) {
    let params = new HttpParams();
    params = params.append('profiles', profiles.join(','));

    if (available) {
      params = params.set('available', String(available));
    }
    return this.http.get<CandidatesDao>(`${this.baseUrl}/candidates`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }), params
    })
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  addCandidate(body: any) {
    const formData: FormData = new FormData();
    formData.append('cv', body.cv, body.cv.name);
    formData.append('name', body.name);
    if (body.info) {
      formData.append('profileInfo', body.info);
    }
    if (body.profiles) {
      body.profiles.forEach(profile => formData.append('profiles', profile));
    }
    return this.http
      .post<any>(`${this.baseUrl}/candidates`, formData, {
        headers: new HttpHeaders({enctype: 'multipart/form-data'}),
      })
      .pipe(data => data, catchError(this.errorHandler.handleError));
  }

  updateCandidate(candidate: Candidate) {
    return this.http.put<CandidatesDao>(`${this.baseUrl}/candidates/${candidate.id}`,
      {available: candidate.available}, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  downloadCandidateCv(candidateId: number): any {
    const options = {
      responseType: 'blob' as 'json'
    };
    return this.http.get(`${this.baseUrl}/candidates/${candidateId}/download-cv`, options);
  }
}
