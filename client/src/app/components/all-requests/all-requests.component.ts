import { Component, OnInit, Output } from '@angular/core';
import { RequestList } from '../../model/request/request-list';
import { RequestService } from '../../services/request/request.service';
import { RequestPropsService } from '../../services/requestProps/requestProps.service';
import { WorkflowService } from '../../services/workflow/workflow.service';
import { Options } from 'ng5-slider';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-requests',
  templateUrl: './all-requests.component.html',
  styleUrls: ['./all-requests.component.css']
})
export class AllRequestsComponent implements OnInit {

  requests: RequestList[];
  states: string[];
  statesCsl: string[];
  skills: string[];
  profiles: string[];
  projects: string[];
  workflows: string[];
  targetDates: string[];
  minValueProgress = 0;
  maxValueProgress = 100;
  minValueQuantity = 1;
  maxValueQuantity = 10;
  optionsQuantity: Options = {
    floor: 1,
    ceil: 10
  };
  optionsProgress: Options = {
    floor: 0,
    ceil: 100,
    step: 25
  };

  requestId: number;
  state: string;
  stateCsl: string;
  skill: string;
  profile: string;
  project: string;
  workflow: string;
  targetDate: string;
  quantity: number;
  progress: number;

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
        this.states = dao.states.map(s => s.state);
      },
        error => {
          console.log(error);
        });
    this.reqPropsService.getRequestStatesCsl()
      .subscribe(dao => {
        this.statesCsl = dao.statesCsl.map(s => s.stateCsl);
      },
        error => {
          console.log(error);
        });
    this.reqPropsService.getRequestProjects()
      .subscribe(dao => {
        this.projects = dao.projects.map(p => p.project);
      },
        error => {
          console.log(error);
        });

    this.reqPropsService.getRequestSkills()
      .subscribe(dao => {
        this.skills = dao.skills.map(s => s.skill);
      },
        error => {
          console.log(error);
        });

    this.reqPropsService.getRequestProfiles()
      .subscribe(dao => {
        this.profiles = dao.profiles.map(p => p.profile);
      },
        error => {
          console.log(error);
        });

    this.workflowService.getAllWorkflows()
      .subscribe(dao => {
        this.workflows = dao.workflows.map(w => w.workflow);
      },
        error => {
          console.log(error);
        });

    this.reqPropsService.getTargetDates()
      .subscribe(dao => {
        this.targetDates = dao.months.map(m => m.month);
      },
        error => {
          console.log(error);
        });
  }

  getRequests() {
    this.requestService.getAllRequests().subscribe(requestDao =>
      this.requests = requestDao.requests.map(r => new RequestList(
        r.id,
        r.workflow,
        r.progress,
        r.state,
        r.description,
        r.dateToSendProfile,
        r.project,
        r.quantity,
        r.requestDate,
        r.skill,
        r.stateCsl,
        r.targetDate,
        r.profile
      )), error => {
        console.log(error);
      }
    );
  }

  onSubmit(form: NgForm) {
    this.requestService.getAllRequestsWithQuery(form.value)
      .subscribe(requestListDao =>
        this.requests = requestListDao.requests.map(r => new RequestList(r.id,
          r.workflow,
          r.progress,
          r.state,
          r.description,
          r.dateToSendProfile,
          r.project,
          r.quantity,
          r.requestDate,
          r.skill,
          r.stateCsl,
          r.targetDate,
          r.profile
        )), error => {
          console.log(error);
        }
      );
  }
}
