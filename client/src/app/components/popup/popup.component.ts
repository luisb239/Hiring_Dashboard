import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Candidate} from '../../model/candidate';
import {ProcessPhase} from '../../model/process-phase';
import {PhaseAttribute} from '../../model/phase-attribute';
import {CandidateDetailsComponent} from '../candidate-details/candidate-details.component';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  @Input()
  phase: ProcessPhase;
  @Input()
  candidate: Candidate;
  @Input()
  attributeTemplates: PhaseAttribute[];
  @Input()
  requestId: number;

  // @Input() attributeValues: PhaseAttributeFilled[]; TODO ???
  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
  }

  seeCandidateDetails() {
    this.activeModal.close('Close click');
    const modalRef = this.modalService.open(CandidateDetailsComponent);
    modalRef.componentInstance.candidateId = this.candidate.id;
    modalRef.componentInstance.requestId = this.requestId;
  }

}
