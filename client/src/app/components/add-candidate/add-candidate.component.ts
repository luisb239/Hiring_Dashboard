import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from '../../model/candidate/candidate';
import { CandidateService } from '../../services/candidate/candidate.service';
import { RequestPropsService } from 'src/app/services/requestProps/requestProps.service';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css']
})
export class AddCandidateComponent implements OnInit {

  @Input() requestId: number;
  candidates: Candidate[];
  profiles: string[];

  constructor(
    public activeModal: NgbActiveModal,
    private candidateService: CandidateService,
    private requestPropsService: RequestPropsService) {
  }

  ngOnInit(): void {
    this.candidateService.getAllCandidates()
      .subscribe(dao => {
        this.candidates = dao.candidates.map(c =>
          new Candidate(c.name, c.id, c.profileInfo, c.available, c.cv));
      }, error => {
        console.log(error);
      });
    this.requestPropsService.getRequestProfiles()
      .subscribe(dao => {
        this.profiles = dao.profiles.map(p => p.profile);
      }, error => {
        console.log(error);
      });
  }

}
