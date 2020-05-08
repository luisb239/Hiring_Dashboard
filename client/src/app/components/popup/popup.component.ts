import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Candidate} from '../../model/candidate';
import {ProcessPhaseService} from '../../services/process-phase/process-phase.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  @Input() candidate: Candidate;

  constructor(public activeModal: NgbActiveModal,
              private processPhaseService: ProcessPhaseService
  ) {
  }
  // processPhase: ProcessPhase;
  ngOnInit(): void {
    // this.processPhaseService.getProcessPhaseById(1, 1, '')
    //   .subscribe(
    //     requests => {},
    //     error => {
    //       console.log(error);
    //     });
  }

}
