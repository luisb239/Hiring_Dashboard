import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpUrlEncodingCodec} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {ErrorHandler} from '../error-handler';
import {ConfigProfilesDao} from 'src/app/model/statistics/config-profiles-dao';
import {ConfigProfileDao} from 'src/app/model/statistics/config-profile-dao';
import {SuccessPostDao} from 'src/app/model/common/successPost-dao';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  baseUrl = `/hd`;
  constructor(private http: HttpClient, private errorHandler: ErrorHandler) { }

  getConfigProfiles(userId: number) {
    return this.http.get<ConfigProfilesDao>(`${this.baseUrl}/users/${userId}/statistics/configs/`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  getConfigProfileDetails(userId: number, profileName: string) {
    const url = new HttpUrlEncodingCodec().encodeValue(profileName);
    return this.http.get<ConfigProfileDao>(`${this.baseUrl}/users/${userId}/statistics/configs/${url}`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  saveConfigProfile(userId: number, requestBody) {
    return this.http.post<SuccessPostDao>(`${this.baseUrl}/users/${userId}/statistics/configs`, requestBody, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  getStatistics() {
    return this.http.get<any>(`${this.baseUrl}/statistics`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }
}
