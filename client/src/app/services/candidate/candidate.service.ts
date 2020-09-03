import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {CandidateDao} from 'src/app/model/candidate/candidate-dao';
import {CandidatesDao} from '../../model/candidate/candidates-dao';
import {SuccessPostDao} from 'src/app/model/common/successPost-dao';
import {forkJoin, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaginationService} from '../../components/datasource/generic-data-source';
import {CandidateDetailsDao} from '../../model/candidate/candidate-details-dao';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class CandidateService implements PaginationService {

  constructor(private http: HttpClient) {
  }

  baseUrl = `/hd`;

  private static getParams(args: any = {}): HttpParams {
    let params = new HttpParams();
    if (args.profiles && args.profiles.length > 0) {
      params = params.append('profiles', args.profiles.join(','));
    }
    if (args.available) {
      params = params.set('available', String(args.available));
    }
    if (args.notInRequest) {
      params = params.set('notInRequest', args.notInRequest);
    }
    return params;
  }

  getCandidateById(candidateId: number) {
    return this.http.get<CandidateDao>(`${this.baseUrl}/candidates/${candidateId}`, httpOptions);
  }

  find(pageNumber?: number, pageSize?: number, args: any = {}): Observable<CandidateDetailsDao[]> {
    let params = CandidateService.getParams(args);
    if (pageNumber !== null && pageNumber !== undefined) {
      params = params.set('pageNumber', pageNumber.toString());
    }
    if (pageSize !== null && pageSize !== undefined) {
      params = params.set('pageSize', pageSize.toString());
    }

    return this.http.get<CandidatesDao>(`${this.baseUrl}/candidates`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }), params
    }).pipe(map(res => res.candidates));
  }

  count(args: any = {}) {
    const params = CandidateService.getParams(args);
    return this.http.get<any>(`${this.baseUrl}/candidates/count`, {
      params
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
      const profileBody = {id, profile: p};
      return this.http.post<SuccessPostDao>(`${this.baseUrl}/candidates/${id}/profiles`,
        profileBody, httpOptions);
    });
  }

  downloadCandidateCv(candidateId: number): any {
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
