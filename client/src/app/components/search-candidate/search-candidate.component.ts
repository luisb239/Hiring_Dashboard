import {Component, OnInit} from '@angular/core';
import {FormControl, FormBuilder, FormGroup} from '@angular/forms';
import {CandidateService} from '../../services/candidate/candidate.service';
import {AlertService} from '../../services/alert/alert.service';
import {CandidateDetailsDao} from '../../model/candidate/candidate-details-dao';
import {RequestPropsService} from '../../services/requestProps/requestProps.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-search-candidate',
  templateUrl: './search-candidate.component.html',
  styleUrls: ['./search-candidate.component.css']
})
export class SearchCandidateComponent implements OnInit {

  profiles: string[];
  filterForm: FormGroup;
  candidatesForm = new FormControl();
  candidates: CandidateDetailsDao[];

  constructor(private requestPropsService: RequestPropsService,
              private formBuilder: FormBuilder,
              private candidateService: CandidateService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    // Get all candidates
    this.fetchAllCandidates();
    // Get profiles
    this.requestPropsService.getRequestProfiles()
      .pipe(map(dao => dao.profiles.map(p => p.profile)))
      .subscribe(result => {
        this.profiles = result;
      }, error => {
        console.log(error);
      });
    // Initialize filter form
    this.filterForm = this.formBuilder.group(
      {
        profiles: this.formBuilder.control([]),
        available: this.formBuilder.control(false)
      }
    );
  }

  filterCandidates() {
    this.candidateService.getAllCandidatesWithQueries(this.filterForm.value.profiles, this.filterForm.value.available)
      .subscribe(result => {
        this.candidates = result.candidates;
      }, error => {
        console.log(error);
      });
  }

  fetchAllCandidates() {
    this.candidateService.getAllCandidates()
      .subscribe(result => {
        this.candidates = result.candidates;
      }, error => {
        console.log(error);
      });
  }
}
