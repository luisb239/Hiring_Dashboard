import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {CandidateDao} from 'src/app/model/candidate/candidate-dao';
import {CandidatesDao} from '../../model/candidate/candidates-dao';
import {SuccessPostDao} from 'src/app/model/common/successPost-dao';
import {forkJoin, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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
    return this.http.post<SuccessPostDao>(`${this.baseUrl}/candidates`, formData, {
      headers: new HttpHeaders({ enctype: 'multipart/form-data' })
    });
  }

  updateCandidate(body: any, id: number) {
    const formData: FormData = new FormData();
    let allRequests = [];
    if (body.cv) {
      formData.append('cv', body.cv, body.cv.name);
    }
    if (body.profileInfo !== undefined) {
      formData.append('profileInfo', body.profileInfo);
    }
    if (body.profiles) {
      allRequests = this.addCandidateProfiles(body, id);
    }
    formData.append('available', String(body.available));
    formData.append('timestamp', body.timestamp);
    allRequests.push(this.http.patch<CandidatesDao>(`${this.baseUrl}/candidates/${id}`,
      formData, {
      headers: new HttpHeaders({ enctype: 'multipart/form-data' })
    }));
    return forkJoin(allRequests);
  }

  removeCandidateProfile(body: any) {
    return this.http.delete<any>(`${this.baseUrl}/candidates/${body.id}/profiles/${body.profile}`,
      httpOptions);
  }

  addCandidateProfiles(body, id): Observable<any>[] {
    return body.profiles.map(p => {
      const profileBody = {
        id,
        profile: p
      };
      return this.http.post<SuccessPostDao>(`${this.baseUrl}/candidates/${id}/profiles`,
        profileBody, httpOptions);
    });

  }

  downloadCandidateCv(candidateId: number): any {
    /*const options = {
      responseType: 'blob' as 'json'
    };*/
    return this.http.get(`${this.baseUrl}/candidates/${candidateId}/download-cv`, {
      responseType: 'blob',
      observe: 'response'
    })
      .pipe(map(resp => {
          const filenameStr = 'filename=';
        const versionIdStr = ';versionId=';
        const disposition = resp.headers.get('Content-disposition');
        const versionIdIndex = disposition.indexOf(versionIdStr);
          return {
            filename: disposition.slice(disposition.indexOf(filenameStr) + filenameStr.length, versionIdIndex),
            versionId: disposition.slice(versionIdIndex + versionIdStr.length),
            blob: resp.body
          };
        })
      );
  }
}
