import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {RequestService} from '../../services/request/request.service';
import {RequestPropsService} from '../../services/requestProps/requestProps.service';
import {WorkflowService} from '../../services/workflow/workflow.service';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {AllRequestsProps} from './all-requests-props';
import {map, tap} from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {GenericDataSource} from '../datasource/generic-data-source';

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

  properties: AllRequestsProps = new AllRequestsProps();

  constructor(
    private router: Router,
    private requestService: RequestService,
    private reqPropsService: RequestPropsService,
    private workflowService: WorkflowService) {
  }

  ngOnInit(): void {
    this.properties.formBuilder = new FormBuilder();
    this.properties.formGroup = this.properties.formBuilder.group({
      skill: this.properties.formBuilder.control(null),
      state: this.properties.formBuilder.control(null),
      stateCsl: this.properties.formBuilder.control(null),
      project: this.properties.formBuilder.control(null),
      profile: this.properties.formBuilder.control(null),
      workflow: this.properties.formBuilder.control(null),
      month: this.properties.formBuilder.control(null),
      quantityValues: this.properties.formBuilder.control([1, 10]),
      progressValues: this.properties.formBuilder.control([0, 100])
    });
    this.properties.dataSource = new GenericDataSource(this.requestService);
    this.properties.dataSource.loadInfo();
    this.count();
    this.fetchFilterParameters();
  }


  ngAfterViewInit() {
    this.paginator.page
      .pipe(tap(() => this.loadTable()))
      .subscribe();
  }

  loadTable() {
    this.properties.dataSource.loadInfo(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.getFilterValues()
    );
  }


  count() {
    this.properties.dataSource.count(
      this.getFilterValues(),
      (count: number) => this.properties.listSize = count);
  }


  fetchFilterParameters() {
    this.reqPropsService.getRequestStates()
      .pipe(map(dao => dao.states.map(s => s.state)))
      .subscribe(result => this.properties.states = result);

    this.reqPropsService.getRequestStatesCsl()
      .pipe(map(dao => dao.statesCsl.map(s => s.stateCsl)))
      .subscribe(result => this.properties.statesCsl = result);

    this.reqPropsService.getRequestProjects()
      .pipe(map(dao => dao.projects.map(p => p.project)))
      .subscribe(result => this.properties.projects = result);

    this.reqPropsService.getRequestSkills()
      .pipe(map(dao => dao.skills.map(s => s.skill)))
      .subscribe(result => this.properties.skills = result);

    this.reqPropsService.getRequestProfiles()
      .pipe(map(dao => dao.profiles.map(p => p.profile)))
      .subscribe(result => this.properties.profiles = result);

    this.workflowService.getAllWorkflows()
      .pipe(map(dao => dao.workflows.map(w => w.workflow)))
      .subscribe(result => this.properties.workflows = result);

    this.reqPropsService.getTargetDates()
      .pipe(map(dao => {
        console.log(dao);
        return dao.months.map(m => m.month);
      }))
      .subscribe(result => {
        console.log(result);
        this.properties.targetDates = result;
      });
  }

  onSubmit() {
    this.loadTable();
    this.count();
  }

  resetForms() {
    this.properties.formGroup.reset({quantityValues: [1, 10], progressValues: [0, 100]});
    this.loadTable();
    this.count();
  }

  getFilterValues() {
    return {
      skill: this.properties.formGroup.value.skill,
      state: this.properties.formGroup.value.state,
      stateCsl: this.properties.formGroup.value.stateCsl,
      project: this.properties.formGroup.value.project,
      profile: this.properties.formGroup.value.profile,
      workflow: this.properties.formGroup.value.workflow,
      targetDate: this.properties.formGroup.value.month,
      minQuantity: this.properties.formGroup.value.quantityValues[0],
      maxQuantity: this.properties.formGroup.value.quantityValues[1],
      minProgress: this.properties.formGroup.value.progressValues[0],
      maxProgress: this.properties.formGroup.value.progressValues[1]
    };
  }
}
