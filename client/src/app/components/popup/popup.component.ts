import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Candidate} from '../../model/candidate';
import {ProcessPhase} from '../../model/process-phase';
import {PhaseAttribute} from '../../model/phase-attribute';

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

  constructor(public activeModal: NgbActiveModal
  ) {
  }

  ngOnInit(): void {
  }

}
