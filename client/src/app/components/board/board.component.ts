import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Candidate} from '../../model/candidate';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PopupComponent} from '../popup/popup.component';
import {RequestService} from '../../services/request/request.service';
import {Request} from '../../model/request';
import {CandidateService} from '../../services/candidate/candidate.service';
import {PhaseService} from '../../services/phase/phase.service';
import {Workflow} from '../../model/workflow';
import {Phase} from '../../model/phase';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  constructor(private modalService: NgbModal,
              private requestService: RequestService,
              private candidateService: CandidateService,
              private phaseService: PhaseService
  ) {
  }

  workflows: Workflow[] = [];

  ngOnInit(): void {
    this.requestService.getRequestsByUser(1, 1)
      .subscribe(
        requestsDao => {
          const requests = requestsDao.map(r => new Request(r.id, r.workflow, r.progress, r.state, r.description));
          this.workflows = [...new Set(requests.map(r => r.workflow))].map(w => new Workflow(w));
          this.workflows.forEach(workflow => {
              this.phaseService.getPhasesByWorkflow(workflow.workflow)
                .subscribe(phasesDao => {
                  workflow.phases = phasesDao.map(p => new Phase(p.phase, p.attributes));
                  workflow.requests = requests.filter(request => request.workflow === workflow.workflow);
                  workflow.requests.forEach(request => {
                    request.phases = phasesDao.map(p => new Phase(p.phase, p.attributes));
                    request.phases.forEach(phase => {
                        this.candidateService.getCandidatesByRequestPhase(request.id, phase.name, true)
                          .subscribe(candidatesDao => {
                            phase.candidates = candidatesDao.candidates.map(c =>
                              new Candidate(c.name, c.profileInfo, c.available, c.cv));
                          });
                      }
                    );
                  }, error => {
                  });
                });
            },
            error => {
            });
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
    modalRef.componentInstance.candidate = candidate;
  }

}
