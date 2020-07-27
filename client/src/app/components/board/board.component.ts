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

import {Candidate} from 'src/app/model/candidate/candidate';
import {RequestList} from 'src/app/model/request/request-list';
import {ProcessPhaseService} from '../../services/process-phase/process-phase.service';
import {BoardProps} from './board-props';
import {AddCandidateComponent} from '../add-candidate/add-candidate.component';
import {AuthService} from '../../services/auth/auth.service';
import {User} from '../../model/user/user';
import {AlertService} from '../../services/alert/alert.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  options = {
    autoClose: true,
    keepAfterRouteChange: true
  };

  properties: BoardProps = new BoardProps();

  constructor(private modalService: NgbModal,
              private requestService: RequestService,
              private workflowService: WorkflowService,
              private processService: ProcessService,
              private candidateService: CandidateService,
              private phaseService: PhaseService,
              private processPhaseService: ProcessPhaseService,
              private authService: AuthService,
              public alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    const user: User = this.authService.getUserInfo();
    this.requestService.getRequestsByUser(user.userId, user.roles[0].roleId)
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
                  this.fetchProcessesInRequest(request);
                });
              }, error => {
                console.log(error);
              });
          });
        });
  }

  fetchProcessesInRequest(request: RequestList) {
    this.processService.getProcessesByRequest(request.id)
      .subscribe(dao => {
        request.phases.forEach(phase => {
          phase.candidates = dao.processes
            .filter(process => process.phase === phase.name)
            .map(process => {
              const candidate = new Candidate(process.candidate.name, process.candidate.id);
              candidate.status = process.status;
              return candidate;
            });
        });
        request.placedCandidates = dao.processes.filter(proc => proc.status === 'Placed').length || 0;
      }, error => {
        console.log(error);
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

  onClick(candidateId: number, request: RequestList, phaseName: string) {
    const modalRef = this.modalService.open(PopupComponent);
    modalRef.componentInstance.requestId = request.id;
    modalRef.componentInstance.candidateId = candidateId;
    modalRef.componentInstance.phaseName = phaseName;
    modalRef.componentInstance.candidateProcessChanged.subscribe(() => {
      this.fetchProcessesInRequest(request);
    });
  }

  addCandidate(request: RequestList) {
    const modalRef = this.modalService.open(AddCandidateComponent);
    modalRef.componentInstance.request = request;
    modalRef.componentInstance.candidateAdded.subscribe(() => {
      this.fetchProcessesInRequest(request);
    });
  }

  hide(event: any, request: RequestList) {
    event.preventDefault();
    request.hidden = !request.hidden;
  }
}
