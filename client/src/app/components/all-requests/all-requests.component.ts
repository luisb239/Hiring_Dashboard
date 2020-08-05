import { Component, OnInit, ViewChild } from '@angular/core';
import { RequestList } from '../../model/request/request-list';
import { RequestService } from '../../services/request/request.service';
import { RequestPropsService } from '../../services/requestProps/requestProps.service';
import { WorkflowService } from '../../services/workflow/workflow.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AllRequestsProps } from './all-requests-props';
import { RequestsDao } from '../../model/request/requests-dao';
import { AuthService } from '../../services/auth/auth.service';
import { map } from 'rxjs/operators';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-all-requests',
  templateUrl: './all-requests.component.html',
  styleUrls: ['./all-requests.component.css']
})
export class AllRequestsComponent implements OnInit {
  displayedColumns: string[] = [
    'Workflow', 'Description', 'Progress', 'Project',
    'Quantity', 'RequestDate', 'SkillCenter', 'CSLState',
    'State', 'TargetDate', 'Profile', 'DateToSendProfile'
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  properties: AllRequestsProps = new AllRequestsProps();

  constructor(
    private router: Router,
    private requestService: RequestService,
    private reqPropsService: RequestPropsService,
    private workflowService: WorkflowService,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getFilterParameters();
    this.getRequests();
  }

  getFilterParameters() {
    this.reqPropsService.getRequestStates()
      .pipe(map(dao => dao.states.map(s => s.state)))
      .subscribe(result => {
        this.properties.states = result;
      },
        error => {
          console.log(error);
        });
    this.reqPropsService.getRequestStatesCsl()
      .pipe(map(dao => dao.statesCsl.map(s => s.stateCsl)))
      .subscribe(result => {
        this.properties.statesCsl = result;
      },
        error => {
          console.log(error);
        });
    this.reqPropsService.getRequestProjects()
      .pipe(map(dao => dao.projects.map(p => p.project)))
      .subscribe(result => {
        this.properties.projects = result;
      },
        error => {
          console.log(error);
        });

    this.reqPropsService.getRequestSkills()
      .pipe(map(dao => dao.skills.map(s => s.skill)))
      .subscribe(result => {
        this.properties.skills = result;
      },
        error => {
          console.log(error);
        });

    this.reqPropsService.getRequestProfiles()
      .pipe(map(dao => dao.profiles.map(p => p.profile)))
      .subscribe(result => {
        this.properties.profiles = result;
      },
        error => {
          console.log(error);
        });

    this.workflowService.getAllWorkflows()
      .pipe(map(dao => dao.workflows.map(w => w.workflow)))
      .subscribe(result => {
        this.properties.workflows = result;
      },
        error => {
          console.log(error);
        });

    this.reqPropsService.getTargetDates()
      .pipe(map(dao => dao.months.map(m => m.month)))
      .subscribe(result => {
        this.properties.targetDates = result;
      },
        error => {
          console.log(error);
        });
  }

  getRequests() {
    this.requestService.getAllRequests()
      .pipe(map(dao => this.mapRequestsDao(dao)))
      .subscribe(result => {
        this.properties.requests = result;
        this.properties.dataSource = new MatTableDataSource(result);
        this.properties.dataSource.paginator = this.paginator;
      },
        error => {
          console.log(error);
        }
      );
  }

  onSubmit(form: NgForm) {
    this.requestService.getAllRequestsWithQuery(form.value)
      .pipe(map(dao => this.mapRequestsDao(dao)))
      .subscribe(result => {
        this.properties.requests = result;
        this.properties.dataSource = new MatTableDataSource(result);
        this.properties.dataSource.paginator = this.paginator;
      },
        error => {
          console.log(error);
        }
      );
  }

  private mapRequestsDao(requestDao: RequestsDao) {
    return requestDao.requests.map(r => new RequestList(r.id,
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
    form.reset({ quantity: [1, 10] });
    form.reset({ progress: [0, 100] });
    this.getRequests();
  }
}
