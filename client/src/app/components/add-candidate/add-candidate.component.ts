import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CandidateService} from '../../services/candidate/candidate.service';
import {RequestPropsService} from 'src/app/services/requestProps/requestProps.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ProcessService} from '../../services/process/process.service';
import {defaultIfEmpty, map, tap} from 'rxjs/operators';
import {RequestService} from '../../services/request/request.service';
import {RequestList} from '../../model/request/request-list';
import {AlertService} from '../../services/alert/alert.service';
import {ErrorType} from '../../services/common-error';
import {GenericDataSource} from '../datasource/generic-data-source';
import {MatPaginator} from '@angular/material/paginator';
import {forkJoin} from 'rxjs';
import {CandidateDetailsDao} from '../../model/candidate/candidate-details-dao';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css']
})
export class AddCandidateComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['Name', 'Availability', 'Assign'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() request: RequestList;
  @Output() candidateAdded = new EventEmitter();
  profiles: string[];
  filterForm: FormGroup;
  DEFAULT_PAGE_SIZE = 10;
  listSize: number;
  dataSource: GenericDataSource;
  checkedCandidates: CandidateDetailsDao[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private candidateService: CandidateService,
    private requestPropsService: RequestPropsService,
    private processService: ProcessService,
    private requestService: RequestService,
    private formBuilder: FormBuilder,
    private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.requestPropsService.getRequestProfiles()
      .pipe(map(dao => dao.profiles.map(p => p.profile)))
      .subscribe(result => this.profiles = result);

    this.filterForm = this.formBuilder.group(
      {
        profiles: this.formBuilder.control([]),
        available: this.formBuilder.control(false)
      });
    this.dataSource = new GenericDataSource(this.candidateService);
    this.dataSource.loadInfo(null, null, {notInRequest: this.request.id});
    this.count();
  }

  onChange(candidate: CandidateDetailsDao, event: any) {
    if (event.checked) {
      this.checkedCandidates.push(candidate);
    } else {
      this.removeCandidate(candidate);
    }
  }

  getCheckedCandidatesNames() {
    return this.checkedCandidates.map(c => c.name).join(', ');
  }

  removeCandidate(candidate: CandidateDetailsDao) {
    this.checkedCandidates.splice(this.checkedCandidates.findIndex(c => c.id === candidate.id), 1);
  }

  isChecked(candidate: CandidateDetailsDao): boolean {
    return this.checkedCandidates.find(c => c.id === candidate.id) !== undefined;
  }

  addCandidatesToRequest() {
    const addCandidatesToRequest = [];
    this.checkedCandidates.forEach(candidate => {
      addCandidatesToRequest.push(this.processService.createProcess(this.request.id, candidate.id));
    });
    forkJoin(addCandidatesToRequest)
      .pipe(defaultIfEmpty(null))
      .subscribe(() => {
          this.alertService.success('Candidate(s) added to this request successfully!');
          this.activeModal.close('Close click');
          this.candidateAdded.emit();
        }, error => {
          if (error === ErrorType.CONFLICT) {
            this.alertService.error('Candidate(s) have already been added to this request by another user.');
            this.activeModal.close('Close click');
          }
          this.candidateAdded.emit();
        }
      );
  }

  count() {
    this.dataSource.count(
      this.getFilterValues(),
      (count: number) => this.listSize = count);
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(tap(() => this.loadTable()))
      .subscribe();
  }

  loadTable() {
    this.dataSource.loadInfo(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.getFilterValues()
    );
  }

  filterCandidates() {
    this.loadTable();
    this.count();
  }

  getFilterValues() {
    return {
      profiles: this.filterForm.value.profiles,
      available: this.filterForm.value.available,
      notInRequest: this.request.id
    };
  }

  resetForms() {
    this.filterForm.reset({profiles: [], available: false, notInRequest: this.request.id});
    this.loadTable();
    this.count();
  }
}
