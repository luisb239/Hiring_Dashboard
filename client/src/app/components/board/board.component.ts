import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PopupComponent} from '../popup/popup.component';
import {RequestService} from '../../services/request/request.service';
import {CandidateService} from '../../services/candidate/candidate.service';
import {PhaseService} from '../../services/phase/phase.service';
import {Workflow} from '../../model/workflow/workflow';
import {Phase} from '../../model/phase/phase';
import {WorkflowService} from '../../services/workflow/workflow.service';
import {ProcessService} from '../../services/process/process.service';
import {ProcessPhase} from '../../model/process/process-phase';
import {PhaseAttribute} from '../../model/phase/phase-attribute';

import {Candidate} from 'src/app/model/candidate/candidate';
import {RequestList} from 'src/app/model/request/request-list';
import {ProcessPhaseService} from '../../services/process-phase/process-phase.service';
import {Process} from '../../model/process/process';
import {BoardProps} from './board-props';
import {AddCandidateComponent} from '../add-candidate/add-candidate.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  constructor(private modalService: NgbModal,
              private requestService: RequestService,
              private workflowService: WorkflowService,
              private processService: ProcessService,
              private candidateService: CandidateService,
              private phaseService: PhaseService,
              private processPhaseService: ProcessPhaseService
  ) {
  }

  properties: BoardProps = new BoardProps();


  ngOnInit(): void {
    this.requestService.getRequestsByUser(2, 1)
      .subscribe(
        requestsDao => {
          this.properties.requests = requestsDao.requests.map(r => new RequestList(r.id, r.workflow, r.progress,
            r.state, r.description, r.quantity));
          this.properties.workflows = [...new Set(this.properties.requests.map(r => r.workflow))].map(w => new Workflow(w));
          this.properties.workflows.forEach(workflow => {
            this.workflowService.getWorkflowByName(workflow.workflow)
              .subscribe(workflowDao => {
                workflow.phases = workflowDao.phases.map(wp => new Phase(wp.phase));
                workflow.requests = this.properties.requests.filter(req => req.workflow === workflow.workflow);
                workflow.requests.forEach(request => {
                  request.phases = workflow.phases;
                  this.processService.getProcessesByRequest(request.id)
                    .subscribe(dao => {
                      request.phases.forEach(phase => {
                        phase.candidates = dao.processes
                          .filter(process => process.phase === phase.name)
                          .map(process => new Candidate(process.candidate.name, process.candidate.id));
                      });
                      request.placedCandidates = dao.processes.filter(proc => proc.status === 'Placed').length;
                    }, error => {
                      console.log(error);
                    });
                });
              }, error => {
                console.log(error);
              });
          });
        });
  }

  drop(event: CdkDragDrop<Candidate[], any>, requestId: number, newPhase: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.processPhaseService.updateProcessPhase(requestId, event.container.data[event.currentIndex].id, newPhase)
        .subscribe();
    }
  }

  onClick(candidateId: number, requestId: number, phaseName: string) {
    const modalRef = this.modalService.open(PopupComponent);

    modalRef.componentInstance.requestId = requestId;
    modalRef.componentInstance.candidateId = candidateId;
    modalRef.componentInstance.phaseName = phaseName;
  }

  addCandidate(requestId: number) {
    const modalRef = this.modalService.open(AddCandidateComponent);
    modalRef.componentInstance.requestId = requestId;
  }
}
