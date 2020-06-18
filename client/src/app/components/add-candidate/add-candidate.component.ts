import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Candidate} from '../../model/candidate/candidate';
import {CandidateService} from '../../services/candidate/candidate.service';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css']
})
export class AddCandidateComponent implements OnInit {

  @Input() requestId: number;
  candidates: Candidate[];
  profiles: string[];

  constructor(public activeModal: NgbActiveModal,
              private candidateService: CandidateService) {
  }

  ngOnInit(): void {
    this.candidateService.getAllCandidates()
      .subscribe(dao => {
      }, error => {
        console.log(error);
      });
  }

}
