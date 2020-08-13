import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {CandidateService} from '../../services/candidate/candidate.service';
import {RequestPropsService} from '../../services/requestProps/requestProps.service';
import {map} from 'rxjs/operators';
import {SearchCandidateProps} from './search-candidate-props';

@Component({
  selector: 'app-search-candidate',
  templateUrl: './search-candidate.component.html',
  styleUrls: ['./search-candidate.component.css']
})
export class SearchCandidateComponent implements OnInit {

  properties: SearchCandidateProps = new SearchCandidateProps();

  constructor(private requestPropsService: RequestPropsService,
              private formBuilder: FormBuilder,
              private candidateService: CandidateService) {
  }

  ngOnInit(): void {
    // Get all candidates
    this.fetchAllCandidates();
    // Get profiles
    this.requestPropsService.getRequestProfiles()
      .pipe(map(dao => dao.profiles.map(p => p.profile)))
      .subscribe(result => {
        this.properties.profiles = result;
      }, error => {
        console.log(error);
      });
    // Initialize filter form
    this.properties.filterForm = this.formBuilder.group(
      {
        profiles: this.formBuilder.control([]),
        available: this.formBuilder.control(false)
      }
    );
  }

  filterCandidates() {
    this.candidateService.getAllCandidatesWithQueries(this.properties.filterForm.value.profiles, this.properties.filterForm.value.available)
      .subscribe(result => {
        this.properties.candidates = result.candidates;
      }, error => {
        console.log(error);
      });
  }

  fetchAllCandidates() {
    this.candidateService.getAllCandidates()
      .subscribe(result => {
        this.properties.candidates = result.candidates;
      }, error => {
        console.log(error);
      });
  }
}
