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

/**
 * This class supplies all the functions needed to manage workflows.
 */
export class WorkflowService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) { }

  baseUrl = `http://localhost:8080/hd`;

  /**
   * This function queries the server for all the existing workflows.
   */
  getAllWorkflows() {
    return this.http.get<WorkflowsDao>(`${this.baseUrl}/requests-properties/workflows`, httpOptions)
      .pipe(data => {
        return data;
      },
        catchError(this.errorHandler.handleError));
  }

  /**
   * This function queries the server for a specific workflow.
   * @param workflowName is used to specify a workflow.
   */
  getWorkflowByName(workflowName: string) {
    return this.http.get<WorkflowDao>(`${this.baseUrl}/workflows/${workflowName}`, httpOptions)
      .pipe(data => {
          return data;
        },
        catchError(this.errorHandler.handleError));
  }
}
