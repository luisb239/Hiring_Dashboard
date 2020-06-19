import {Component, OnInit, Output} from '@angular/core';
import {RequestList} from '../../model/request/request-list';
import {RequestService} from '../../services/request/request.service';
import {RequestPropsService} from '../../services/requestProps/requestProps.service';
import {WorkflowService} from '../../services/workflow/workflow.service';
import {Options} from 'ng5-slider';
import {NgForm, NgModel} from '@angular/forms';
import {Router} from '@angular/router';
import {AllRequestsProps} from './all-requests-props';
import {RequestsDao} from '../../model/request/requests-dao';

@Component({
  selector: 'app-all-requests',
  templateUrl: './all-requests.component.html',
  styleUrls: ['./all-requests.component.css']
})
export class AllRequestsComponent implements OnInit {

  properties: AllRequestsProps = new AllRequestsProps();

  constructor(
    private router: Router,
    private requestService: RequestService,
    private reqPropsService: RequestPropsService,
    private workflowService: WorkflowService) {
  }

  ngOnInit(): void {
    this.getFilterParameters();
    this.getRequests();
  }

  getFilterParameters() {
    this.reqPropsService.getRequestStates()
      .subscribe(dao => {
          this.properties.states = dao.states.map(s => s.state);
        },
        error => {
          console.log(error);
        });
    this.reqPropsService.getRequestStatesCsl()
      .subscribe(dao => {
          this.properties.statesCsl = dao.statesCsl.map(s => s.stateCsl);
        },
        error => {
          console.log(error);
        });
    this.reqPropsService.getRequestProjects()
      .subscribe(dao => {
          this.properties.projects = dao.projects.map(p => p.project);
        },
        error => {
          console.log(error);
        });

    this.reqPropsService.getRequestSkills()
      .subscribe(dao => {
          this.properties.skills = dao.skills.map(s => s.skill);
        },
        error => {
          console.log(error);
        });

    this.reqPropsService.getRequestProfiles()
      .subscribe(dao => {
          this.properties.profiles = dao.profiles.map(p => p.profile);
        },
        error => {
          console.log(error);
        });

    this.workflowService.getAllWorkflows()
      .subscribe(dao => {
          this.properties.workflows = dao.workflows.map(w => w.workflow);
        },
        error => {
          console.log(error);
        });

    this.reqPropsService.getTargetDates()
      .subscribe(dao => {
          this.properties.targetDates = dao.months.map(m => m.month);
        },
        error => {
          console.log(error);
        });
  }

  getRequests() {
    this.requestService.getAllRequests().subscribe(requestDao => {
        this.setRequests(requestDao);
      }
      , error => {
        console.log(error);
      }
    );
  }

  onSubmit(form: NgForm) {
    this.requestService.getAllRequestsWithQuery(form.value)
      .subscribe(requestListDao => {
          this.setRequests(requestListDao);
        },
        error => {
          console.log(error);
        }
      );
  }

  private setRequests(requestDao: RequestsDao) {
    this.properties.requests = requestDao.requests.map(r => new RequestList(r.id,
      r.workflow,
      r.progress,
      r.state,
      r.description,
      r.quantity,
      r.dateToSendProfile,
      r.project,
      r.requestDate,
      r.skill,
      r.stateCsl,
      r.targetDate,
      r.profile));
  }

  resetForms(form: NgForm) {
    form.reset({quantity: [0, 10]});
    form.reset({progress: [0, 100]});
    form.resetForm();
    this.getRequests();
  }
}
