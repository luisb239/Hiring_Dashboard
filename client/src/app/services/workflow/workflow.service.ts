import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ErrorHandler } from '../error-handler';
import { WorkflowsDao } from 'src/app/model/workflow/workflows-dao';
import {WorkflowDao} from '../../model/workflow/workflow-dao';

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

  baseUrl = `http://localhost:8080/hd`;

  getAllWorkflows() {
    return this.http.get<WorkflowsDao>(`${this.baseUrl}/requests-properties/workflows`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  getWorkflowByName(workflowName: string) {
    return this.http.get<WorkflowDao>(`${this.baseUrl}/workflows/${workflowName}`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }
}
