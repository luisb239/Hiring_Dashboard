import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PopupComponent} from '../popup/popup.component';
import {RequestService} from '../../services/request/request.service';
import {Workflow} from '../../model/workflow/workflow';
import {Phase} from '../../model/phase/phase';
import {WorkflowService} from '../../services/workflow/workflow.service';
import {ProcessService} from '../../services/process/process.service';

import {Candidate} from 'src/app/model/candidate/candidate';
import {RequestList} from 'src/app/model/request/request-list';
import {ProcessPhaseService} from '../../services/process-phase/process-phase.service';
import {BoardProps} from './board-props';
import {AddCandidateComponent} from '../add-candidate/add-candidate.component';
import {AlertService} from '../../services/alert/alert.service';
import {Content} from './content';
import {map, startWith} from 'rxjs/operators';
import {ErrorType} from '../../services/common-error';
import * as moment from 'moment';

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
              private processPhaseService: ProcessPhaseService,
              private alertService: AlertService
  ) {
  }

  properties: BoardProps = new BoardProps();


  private static _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  ngOnInit(): void {
    this.getAllRequests();
  }

  private _filter(value: string): string[] {
    const filterValue = BoardComponent._normalizeValue(value);
    return this.properties.content.options.filter(option => BoardComponent._normalizeValue(option).includes(filterValue));
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
        this.properties.timestampDictionary[request.id] = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
      }, () => {
        this.alertService.error('Unexpected server error. Refresh and try again.');
      });
  }

  drop(event: CdkDragDrop<Candidate[], any>, request: RequestList, newPhase: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.processPhaseService.updateProcessPhase(request.id, event.container.data[event.currentIndex].id,
        newPhase, this.properties.timestampDictionary[request.id])
        .subscribe(() => {
            this.alertService.success('Candidate successfully switched phases');
            this.fetchProcessesInRequest(request);
          },
          error => {
            if (error === ErrorType.PRECONDITION_FAILED) {
              this.alertService.error('This card has already been moved by another user.');
              this.alertService.info('Fetching requests again...');
              this.fetchProcessesInRequest(request);
            } else {
              this.alertService.error('Unexpected server error. Refresh and try again.');
            }
          });
    }
  }

  onClick(candidateId: number, request: RequestList, phaseName: string) {
    const modalRef = this.modalService.open(PopupComponent, { size: 'lg' });
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

  setContent(idx: number) {
    switch (idx) {
      case 0:
        this.properties.content.options = this.properties.allWorkflows;
        this.properties.content.name = 'Workflow';
        break;
      case 1:
        this.properties.content.options = this.properties.allRequests;
        this.properties.content.name = 'Description';
        break;
    }
    this.properties.filteredOptions = this.properties.control.valueChanges.pipe(
      startWith(''),
      map(value => {
        return this._filter(value);
      }));
  }

  filter(event: any) {
    event.preventDefault();
    if (this.properties.content.name === 'Description') {
      this.filterByDescription();
    } else if (this.properties.content.name === 'Workflow') {
      this.filterByWorkflow();
    }
  }

  filterByDescription() {
    this.requestService.getUserCurrentRequests()
      .subscribe(
        requestsDao => {
          const filteredRequest = requestsDao.requests
            .find(r => r.description === this.properties.control.value);
          this.properties.requests = [];
          this.properties.requests.push(new RequestList(filteredRequest.id, filteredRequest.workflow, filteredRequest.progress,
            filteredRequest.state, filteredRequest.description, filteredRequest.quantity));
          this.properties.requests.forEach(request =>
            this.properties.timestampDictionary[request.id] = moment().format('YYYY-MM-DDTHH:mm:ss.SSS'));
          this.properties.workflows = [];
          this.properties.workflows.push(new Workflow(filteredRequest.workflow));
          this.properties.workflows.forEach(workflow => {
            this.workflowService.getWorkflowByName(workflow.workflow)
              .subscribe(workflowDao => {
                workflow.phases = workflowDao.phases.map(wp => new Phase(wp.phase));
                workflow.requests = this.properties.requests;
                workflow.requests.forEach(request => {
                  workflow.phases.forEach(p => request.phases.push(new Phase(p.name, [])));
                  this.fetchProcessesInRequest(request);
                });
              }, () => {
                this.alertService.error('Unexpected server error. Refresh and try again.');
              });
          });
        });
  }

  filterByWorkflow() {
    this.requestService.getUserCurrentRequests()
      .subscribe(
        requestsDao => {
          this.properties.requests = requestsDao.requests
            .filter(r => r.workflow === this.properties.control.value)
            .map(r => new RequestList(r.id, r.workflow, r.progress,
              r.state, r.description, r.quantity));
          this.properties.requests.forEach(request =>
            this.properties.timestampDictionary[request.id] = moment().format('YYYY-MM-DDTHH:mm:ss.SSS'));
          this.properties.workflows = [];
          this.properties.workflows.push(new Workflow(this.properties.requests[0].workflow));
          this.workflowService.getWorkflowByName(this.properties.workflows[0].workflow)
            .subscribe(workflowDao => {
              this.properties.workflows[0].phases = workflowDao.phases
                .map(wp => new Phase(wp.phase));
              this.properties.workflows[0].requests = this.properties.requests
                .filter(req => req.workflow === this.properties.workflows[0].workflow);
              this.properties.workflows[0].requests.forEach(request => {
                this.properties.workflows[0].phases.forEach(p => request.phases.push(new Phase(p.name, [])));
                this.fetchProcessesInRequest(request);
              });
            }, () => {
              this.alertService.error('Unexpected server error. Refresh and try again.');
            });
        });
  }

  getAllRequests() {
    this.requestService.getUserCurrentRequests()
      .pipe(
        map(dao => {
          return {
            requests: dao.requests.map(r => new RequestList(r.id, r.workflow, r.progress,
              r.state, r.description, r.quantity))
          };
        }),
        map(data => {
          const workflows = [...new Set(data.requests.map(r => r.workflow))].map(w => new Workflow(w));
          return {...data, workflows};
        })
      ).subscribe(
      result => {
        this.properties.requests = result.requests;
        this.properties.requests.forEach(request =>
          this.properties.timestampDictionary[request.id] = moment().format('YYYY-MM-DDTHH:mm:ss.SSS'));
        this.properties.workflows = result.workflows;
        this.properties.allRequests = this.properties.requests.map(r => r.description);
        this.properties.allWorkflows = this.properties.workflows.map(w => w.workflow);
        this.properties.content = new Content('Workflow', this.properties.allWorkflows);
        this.properties.filteredOptions = this.properties.control.valueChanges.pipe(
          startWith(''),
          map(value => {
            return this._filter(value);
          }));
        this.properties.workflows.forEach(workflow => {
          this.workflowService.getWorkflowByName(workflow.workflow)
            .subscribe(workflowDao => {
              workflow.phases = workflowDao.phases.map(wp => new Phase(wp.phase));
              workflow.requests = this.properties.requests.filter(req => req.workflow === workflow.workflow);
              workflow.requests.forEach(request => {
                workflow.phases.forEach(p => request.phases.push(new Phase(p.name, [])));
                this.fetchProcessesInRequest(request);
              });
            }, () => {
              this.alertService.error('Unexpected server error. Refresh and try again.');
            });
        });
      });
  }

  reset() {
    this.properties.control.reset();
    this.getAllRequests();
  }
}
