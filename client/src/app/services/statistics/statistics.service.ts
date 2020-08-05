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

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  getUserConfigProfiles() {
    return this.http.get<ConfigProfilesDao>(`${this.baseUrl}/statistics/configs/`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  getUserConfigProfileDetails(profileName: string) {
    const url = new HttpUrlEncodingCodec().encodeValue(profileName);
    return this.http.get<ConfigProfileDao>(`${this.baseUrl}/statistics/configs/${url}`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }

  saveUserConfigProfiles(requestBody) {
    return this.http.post<SuccessPostDao>(`${this.baseUrl}/statistics/configs`, requestBody, httpOptions)
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
