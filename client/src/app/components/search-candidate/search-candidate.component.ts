import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {CandidateService} from '../../services/candidate/candidate.service';
import {RequestPropsService} from '../../services/requestProps/requestProps.service';
import {map, tap} from 'rxjs/operators';
import {SearchCandidateProps} from './search-candidate-props';
import {MatPaginator} from '@angular/material/paginator';
import {GenericDataSource} from '../datasource/generic-data-source';

@Component({
  selector: 'app-search-candidate',
  templateUrl: './search-candidate.component.html',
  styleUrls: ['./search-candidate.component.css']
})
export class SearchCandidateComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['Name', 'Availability'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  properties: SearchCandidateProps = new SearchCandidateProps();

  constructor(private requestPropsService: RequestPropsService,
              private formBuilder: FormBuilder,
              private candidateService: CandidateService) {
  }

  ngOnInit(): void {
    // Get profiles
    this.requestPropsService.getRequestProfiles()
      .pipe(map(dao => dao.profiles.map(p => p.profile)))
      .subscribe(result => this.properties.profiles = result);
    // Initialize filter form
    this.properties.filterForm = this.formBuilder.group(
      {
        profiles: this.formBuilder.control([]),
        available: this.formBuilder.control(false)
      });
    this.properties.dataSource = new GenericDataSource(this.candidateService);
    this.properties.dataSource.loadInfo();
    this.count();
  }

  count() {
    this.properties.dataSource.count(
      this.getFilterValues(),
      (count: number) => this.properties.listSize = count);
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

  getFilterValues() {
    return {
      profiles: this.properties.filterForm.value.profiles,
      available: this.properties.filterForm.value.available
    };
  }

  onSubmit() {
    this.loadTable();
    this.count();
  }

  resetForms() {
    this.properties.filterForm.reset({profiles: [], available: false});
    this.loadTable();
    this.count();
  }
}
