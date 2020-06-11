import {Component, OnInit} from '@angular/core';
import {CandidateService} from '../../services/candidate/candidate.service';
import { Router } from '@angular/router';
import { Candidate } from 'src/app/model/candidate/candidate';


@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit {

  candidateId: number;
  requestId: number;
  candidate: Candidate;

  constructor(private candidateService: CandidateService,
              private router: Router
              ) {
  }

  ngOnInit(): void {
    this.candidateId = history.state.candidateId || this.router.url.split('/')[2];
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
