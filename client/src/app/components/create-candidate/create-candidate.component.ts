import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../services/candidate/candidate.service';
import { map, mergeMap } from 'rxjs/operators';
import { RequestPropsService } from '../../services/requestProps/requestProps.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert/alert.service';
import { CreateCandidateProps } from './create-candidate-props';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-candidate',
  templateUrl: './create-candidate.component.html',
  styleUrls: ['./create-candidate.component.css']
})
export class CreateCandidateComponent implements OnInit {

  properties: CreateCandidateProps = new CreateCandidateProps();

  constructor(
    private candidateService: CandidateService,
    private requestPropsService: RequestPropsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.requestPropsService.getRequestProfiles()
      .pipe(map(dao => dao.profiles.map(p => p.profile)))
      .subscribe(result => {
        this.properties.profiles = result;
      }, () => {
        this.alertService.error('Unexpected server error. Refresh and try again.');
      });
    this.properties.createForm = this.formBuilder.group({
      name: this.formBuilder.control(''),
      info: this.formBuilder.control(''),
      profiles: this.formBuilder.control([])
    });
  }

  handleFileInput(files: FileList) {
    // Check if filesList size == 1
    this.properties.fileToUpload = files.item(0);
  }

  onSubmit() {
    if (!this.properties.createForm.value.name || this.properties.fileToUpload === null) {
      this.alertService.warn('Please insert a name and a CV.');
    } else {
      const body: { name: string, cv: File, info?: string, profiles?: string } = {
        name: this.properties.createForm.value.name,
        cv: this.properties.fileToUpload
      };
      if (this.properties.createForm.value.info !== '') {
        body.info = this.properties.createForm.value.info;
      }
      if (this.properties.createForm.value.profiles.length > 0) {
        body.profiles = this.properties.createForm.value.profiles;
      }
      this.candidateService.addCandidate(body)
        .pipe(mergeMap(dao => {
          if (body.profiles) {
            const postProfilesRequests = this.candidateService.addCandidateProfiles(body, dao.id);
            return forkJoin(postProfilesRequests).pipe(map(res => {
              return dao;
            }));
          }
        })).subscribe((res) => {
          this.alertService.success('Candidate added to the system');
          this.router.navigate(['/candidates', res.id]);
        }, () =>
          this.alertService.error('Unexpected server error. Refresh and try again.'));
    }
  }
}
