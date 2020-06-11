import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ProcessPhase} from '../../model/process/process-phase';
import {PhaseAttribute} from '../../model/phase/phase-attribute';
import { Candidate } from 'src/app/model/candidate/candidate';

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
