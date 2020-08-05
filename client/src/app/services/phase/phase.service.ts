import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpUrlEncodingCodec} from '@angular/common/http';
import {PhaseDao} from '../../model/phase/phase-dao';
import {WorkflowPhasesDao} from '../../model/workflow/workflow-phases-dao';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PhaseService {

  constructor(private http: HttpClient) {
  }

  baseUrl = `/hd`;

  getPhasesByWorkflow(workflowName: string) {
    const url = new HttpUrlEncodingCodec().encodeValue(workflowName);
    return this.http.get<WorkflowPhasesDao>(`${this.baseUrl}/workflows/${url}`, httpOptions);
  }

  getPhase(phaseName: string) {
    const url = new HttpUrlEncodingCodec().encodeValue(phaseName);
    return this.http.get<PhaseDao>(`${this.baseUrl}/phases/${url}`, httpOptions);
  }
}
