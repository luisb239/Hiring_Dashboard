import {Component, Input, OnInit} from '@angular/core';
import {CandidateService} from '../../services/candidate/candidate.service';
import {Candidate} from '../../model/candidate';

@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit {

  candidateId: number;
  requestId: number;
  candidate: Candidate;

  constructor(private candidateService: CandidateService) {
  }

  ngOnInit(): void {
    this.candidateId = history.state.candidateId;
    this.requestId = history.state.requestId;

    this.candidateService.getCandidateById(this.candidateId)
      .subscribe(dao => {
        const result = dao.candidate;
        this.candidate = new Candidate(result.name,
          result.id,
          result.profileInfo,
          result.available,
          result.cv);
      }, error => {
      });


  }

}
