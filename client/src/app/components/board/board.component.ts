import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Candidate} from '../../model/candidate';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PopupComponent} from '../popup/popup.component';
import {RequestService} from '../../services/request/request.service';
import {CandidateService} from '../../services/candidate/candidate.service';
import {PhaseService} from '../../services/phase/phase.service';
import {Workflow} from '../../model/workflow';
import {Phase} from '../../model/phase';
import {WorkflowService} from '../../services/workflow/workflow.service';
import {ProcessService} from '../../services/process/process.service';
import {ProcessPhase} from '../../model/process-phase';
import {PhaseAttribute} from '../../model/phase-attribute';
import {RequestList} from '../../model/request-list';

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
              private phaseService: PhaseService
  ) {
  }

  workflows: Workflow[] = [];
  private requests: RequestList[] = [];

  ngOnInit(): void {
    this.requestService.getRequestsByUser(1, 1)
      .subscribe(
        requestsDao => {
          this.requests = requestsDao.requests.map(r => new RequestList(r.id, r.workflow, r.progress, r.state, r.description));
          this.workflows = [...new Set(this.requests.map(r => r.workflow))].map(w => new Workflow(w));
          this.workflows.forEach(workflow => {
            this.workflowService.getWorkflowByName(workflow.workflow)
              .subscribe(workflowDao => {
                workflow.phases = workflowDao.phases.map(wp => new Phase(wp.phase));
                workflow.requests = this.requests.filter(req => req.workflow === workflow.workflow);
                workflow.requests.forEach(request => {
                  request.phases = workflow.phases;
                  this.processService.getProcessesByRequest(request.id)
                    .subscribe(dao => {
                      request.phases.forEach(phase => {
                        phase.candidates = dao.processes
                          .filter(process => process.phase === phase.name)
                          .map(process => new Candidate(process.candidate.name, process.candidate.id));
                      });
                    }, error => {
                    });
                });
              }, error => {
              });
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

  onClick(candidateId: number, requestId: number, phaseName: string) {
    const modalRef = this.modalService.open(PopupComponent);

    modalRef.componentInstance.requestId = requestId;

    this.candidateService.getCandidateById(candidateId)
      .subscribe(dao => {
        modalRef.componentInstance.candidate = new Candidate(dao.candidate.name,
          dao.candidate.id,
          dao.candidate.profileInfo,
          dao.candidate.available,
          dao.candidate.cv);
      }, error => {
      });
    this.processService.getProcess(requestId, candidateId)
      .subscribe(dao => {
        const phaseDetails = dao.phases.find(p => p.phase === dao.currentPhase);
        modalRef.componentInstance.phase = new ProcessPhase(phaseDetails.startDate, phaseDetails.updateDate, phaseDetails.notes);
      }, error => {
      });
    this.phaseService.getPhase(phaseName)
      .subscribe(dao => {
        modalRef.componentInstance.attributeTemplates = dao
          .infos.map(pi => new PhaseAttribute(pi.name, pi.type));
      }, error => {
      });
  }
}
