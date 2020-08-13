import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { CandidateDao } from 'src/app/model/candidate/candidate-dao';
import { CandidatesDao } from '../../model/candidate/candidates-dao';
import { SuccessPostDao } from 'src/app/model/common/successPost-dao';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private http: HttpClient) {
  }

  baseUrl = `/hd`;

  getCandidateById(candidateId: number) {
    return this.http.get<CandidateDao>(`${this.baseUrl}/candidates/${candidateId}`, httpOptions);
  }

  getAllCandidates() {
    return this.http.get<CandidatesDao>(`${this.baseUrl}/candidates`, httpOptions);
  }

  getAllCandidatesWithQueries(profiles: string[], available: boolean) {
    let params = new HttpParams();
    if (profiles && profiles.length > 0) {
      params = params.append('profiles', profiles.join(','));
    }

    if (available) {
      params = params.set('available', String(available));
    }
    return this.http.get<CandidatesDao>(`${this.baseUrl}/candidates`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }), params
    });
  }

  addCandidate(body: any) {
    const formData: FormData = new FormData();
    formData.append('cv', body.cv, body.cv.name);
    formData.append('name', body.name);
    if (body.info) {
      formData.append('profileInfo', body.info);
    }
    if (body.profiles) {
      // body.profiles.forEach(profile => formData.append('profiles', profile));
      formData.append('profiles', JSON.stringify(body.profiles));
    }
    return this.http
      .post<any>(`${this.baseUrl}/candidates`, formData, {
        headers: new HttpHeaders({enctype: 'multipart/form-data'}),
      });
  }

  updateCandidate(body: any) {
    const formData: FormData = new FormData();
    if (body.cv) {
      formData.append('cv', body.cv, body.cv.name);
    }
    if (body.profileInfo) {
      formData.append('profileInfo', body.profileInfo);
    }
    if (body.profiles) {
      formData.append('profiles', JSON.stringify(body.profiles));
    }
    formData.append('available', String(body.available));
    formData.append('timestamp', String(body.timestamp));
    return this.http.patch<CandidatesDao>(`${this.baseUrl}/candidates/${body.id}`,
      formData, {
        headers: new HttpHeaders({enctype: 'multipart/form-data'})
      });
  }

  removeCandidateProfile(body: any) {
    return this.http.delete<SuccessPostDao>(`${this.baseUrl}/candidates/${body.id}/profiles/${body.profile}`,
      httpOptions);
  }

  downloadCandidateCv(candidateId: number): any {
    const options = {
      responseType: 'blob' as 'json'
    };
    return this.http.get(`${this.baseUrl}/candidates/${candidateId}/download-cv`, options);
  }
}
