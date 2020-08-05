import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProcessPhaseService {

  constructor(private http: HttpClient) {
  }

  baseUrl = `/hd`;

  updateProcessPhase(requestId: number, candidateId: number, newPhase: string) {
    return this.http.put(`${this.baseUrl}/requests/${requestId}/candidates/${candidateId}/process`,
      {newPhase}, httpOptions);
  }

  updateProcessPhaseNotes(requestId: number, candidateId: number, phase: string, notes: string) {
    return this.http.put(`${this.baseUrl}/requests/${requestId}/candidates/${candidateId}/process/phases/${phase}`,
      {notes}, httpOptions);
  }
}
