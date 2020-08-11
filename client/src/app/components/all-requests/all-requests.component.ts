import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {RequestList} from '../../model/request/request-list';
import {RequestService} from '../../services/request/request.service';
import {RequestPropsService} from '../../services/requestProps/requestProps.service';
import {WorkflowService} from '../../services/workflow/workflow.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AllRequestsProps} from './all-requests-props';
import {RequestsDao} from '../../model/request/requests-dao';
import {map, tap} from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {AllRequestsDataSource} from './all-requests-data-source';

@Component({
  selector: 'app-all-requests',
  templateUrl: './all-requests.component.html',
  styleUrls: ['./all-requests.component.css']
})
export class AllRequestsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'Workflow', 'Description', 'Progress', 'Project',
    'Quantity', 'RequestDate', 'SkillCenter', 'CSLState',
    'State', 'TargetDate', 'Profile', 'DateToSendProfile'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  formGroup: FormGroup;
  formBuilder: FormBuilder;
  properties: AllRequestsProps = new AllRequestsProps();

  dataSource: AllRequestsDataSource;

  DEFAULT_PAGE_SIZE = 10;
  listSize: number;

  constructor(
    private router: Router,
    private requestService: RequestService,
    private reqPropsService: RequestPropsService,
    private workflowService: WorkflowService) {
  }

  ngOnInit(): void {
    this.formBuilder = new FormBuilder();
    this.formGroup = this.formBuilder.group({
      skill: this.formBuilder.control(null),
      state: this.formBuilder.control(null),
      stateCsl: this.formBuilder.control(null),
      project: this.formBuilder.control(null),
      profile: this.formBuilder.control(null),
      workflow: this.formBuilder.control(null),
      month: this.formBuilder.control(null),
      quantityValues: this.formBuilder.control([1, 10]),
      progressValues: this.formBuilder.control([0, 100])
      // minQuantity: this.formBuilder.control(0),
      // maxQuantity: this.formBuilder.control(Infinity),
      // minProgress: this.formBuilder.control(0),
      // maxProgress: this.formBuilder.control(Infinity),
    });
    this.dataSource = new AllRequestsDataSource(this.requestService);
    this.dataSource.loadRequests();
    this.count();
    this.getFilterParameters();
    // this.dataSource.load();
    // this.getRequests();
  }


  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.loadTable())
      )
      .subscribe();
  }

  loadTable() {
    this.dataSource.loadRequests(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      {
        skill: this.formGroup.value.skill,
        state: this.formGroup.value.state,
        stateCsl: this.formGroup.value.stateCsl,
        project: this.formGroup.value.project,
        profile: this.formGroup.value.profile,
        workflow: this.formGroup.value.workflow,
        month: this.formGroup.value.month,
        minQuantity: this.formGroup.value.quantityValues[0],
        maxQuantity: this.formGroup.value.quantityValues[1],
        minProgress: this.formGroup.value.progressValues[0],
        maxProgress: this.formGroup.value.progressValues[1]
      });
  }


  count() {
    // ter em conta o form group
    this.dataSource.count({
      skill: this.formGroup.value.skill,
      state: this.formGroup.value.state,
      stateCsl: this.formGroup.value.stateCsl,
      project: this.formGroup.value.project,
      profile: this.formGroup.value.profile,
      workflow: this.formGroup.value.workflow,
      month: this.formGroup.value.month,
      minQuantity: this.formGroup.value.quantityValues[0],
      maxQuantity: this.formGroup.value.quantityValues[1],
      minProgress: this.formGroup.value.progressValues[0],
      maxProgress: this.formGroup.value.progressValues[1]
    }, (count: number) => this.listSize = count);
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

  onSubmit() {
    this.loadTable();
    this.count();
  }

  resetForms() {
    this.formGroup.reset({quantityValues: [1, 10], progressValues: [0, 100]});
    this.loadTable();
    this.count();
  }
}
