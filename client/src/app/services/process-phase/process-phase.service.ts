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

  updateProcessPhase(requestId: number, candidateId: number, newPhase: string, timestamp: string) {
    return this.http.put(`${this.baseUrl}/requests/${requestId}/candidates/${candidateId}/process`,
      {newPhase, timestamp}, httpOptions);
  }

  updateProcessPhaseNotes(requestId: number, candidateId: number, phase: string, notes: string, timestamp: string) {
    return this.http.put(`${this.baseUrl}/requests/${requestId}/candidates/${candidateId}/process/phases/${phase}`,
      {notes, timestamp}, httpOptions);
  }
}
