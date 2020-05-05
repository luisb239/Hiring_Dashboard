import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Candidate} from '../../model/candidate';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  @Input() candidate: Candidate;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
