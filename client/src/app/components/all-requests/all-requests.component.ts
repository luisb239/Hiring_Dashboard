import { Component, OnInit, Output } from '@angular/core';
import { RequestList } from '../../model/request-list';
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
      .subscribe(states => {
        this.states = states.states;
      },
        error => {
          console.log(error);
        });
    this.reqPropsService.getRequestStatesCsl()
      .subscribe(stateCsl => {
        this.statesCsl = stateCsl.statesCsl;
      },
        error => {
          console.log(error);
        });
    this.reqPropsService.getRequestProjects()
      .subscribe(project => {
        this.projects = project.projects;
      },
        error => {
          console.log(error);
        });

    this.reqPropsService.getRequestSkills()
      .subscribe(skill => {
        this.skills = skill.skills;
      },
        error => {
          console.log(error);
        });

    this.reqPropsService.getRequestProfiles()
      .subscribe(profile => {
        this.profiles = profile.profiles;
      },
        error => {
          console.log(error);
        });

    this.workflowService.getAllWorkflows()
      .subscribe(workflow => {
        this.workflows = workflow.workflows;
      },
        error => {
          console.log(error);
        });

    this.reqPropsService.getTargetDates()
      .subscribe(month => {
        this.targetDates = month.months;
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
        [],
        r.dateToSendProfile,
        r.project,
        r.quantity,
        r.requestDate,
        r.skill,
        r.stateCsl,
        r.targetDate,
        r.profile
      )), error => {
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
          [],
          r.dateToSendProfile,
          r.project,
          r.quantity,
          r.requestDate,
          r.skill,
          r.stateCsl,
          r.targetDate,
          r.profile
        )), error => {
        }
      );
  }
}
