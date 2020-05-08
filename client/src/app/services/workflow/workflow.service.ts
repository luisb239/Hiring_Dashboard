import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ErrorHandler } from '../error-handler';
import { WorkflowDao } from 'src/app/model/dao/workflow-dao'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) { }

  baseUrl = `http://localhost:8080/hd/requests-properties`;

  getAllWorkflows() {
    return this.http.get<WorkflowDao>(`${this.baseUrl}/workflows`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }
}
