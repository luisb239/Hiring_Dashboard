import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Candidate} from '../../model/candidate';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PopupComponent} from '../popup/popup.component';
import {RequestService} from '../../services/request/request.service';
import {Board} from '../../model/board';
import {Column} from '../../model/column';
import {Request} from '../../model/request';
import {CandidateService} from '../../services/candidate/candidate.service';
import {PhaseService} from '../../services/phase/phase.service';
import {Workflow} from '../../model/workflow';
import {Phase} from "../../model/phase";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  closeResult = '';

  constructor(private modalService: NgbModal,
              private requestService: RequestService,
              private candidateService: CandidateService,
              private phaseService: PhaseService
  ) {
  }

  workflows: Workflow[] = [];
  hidden = false;
  requests: Request[] = [];
  candidates: Candidate[] = [];
  phases: Phase[] = [];
  // board: Board = new Board('Test', []);
  board: Board = new Board('Test Board', [
    new Column('Ideas', [
      new Candidate('Some random idea'),
      new Candidate('This is another random idea'),
      new Candidate('build an awesome application')
    ]),
    new Column('Research', [
      new Candidate('Lorem ipsum'),
      new Candidate('foo'),
      new Candidate('This was in the \'Research\' column')
    ]),
    new Column('Todo', [
      new Candidate('Get to work'),
      new Candidate('Pick up groceries'),
      new Candidate('Go home'),
      new Candidate('Fall asleep')
    ]),
    new Column('Done', [
      new Candidate('Get up'),
      new Candidate('Brush teeth'),
      new Candidate('Take a shower'),
      new Candidate('Check e-mail'),
      new Candidate('Walk dog')
    ])
  ]);

  ngOnInit(): void {
    this.requestService.getRequestsByUser(1, 1)
      .subscribe(
        requests => {
          this.requests = requests.map(r => new Request(r.workflow, r.progress, r.state));
          this.workflows = [...new Set(this.requests.map(r => r.workflow))].map(w => new Workflow(w, []));
          this.workflows.forEach(workflow =>
            this.phaseService.getPhasesByWorkflow(workflow.workflow).subscribe(
              phases => {
                workflow.phases = phases.map(phase => new Phase(phase.phase, phase.phase_attributes));
              }, error => {
                console.log(error);
              }
            )
          );
        },
        error => {
          console.log(error);
        });
  }

  drop(event: CdkDragDrop<Candidate[], any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  onClick(candidate: Candidate) {
    const modalRef = this.modalService.open(PopupComponent);
    candidate.available = false;
    modalRef.componentInstance.candidate = candidate;
  }

  toggleRow(idx: number) {
    this.board.columns[idx].hidden = !this.board.columns[idx].hidden;
  }

  hide() {
    this.hidden = !this.hidden;
  }

}
