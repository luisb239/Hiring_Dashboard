import {Component, OnInit} from '@angular/core';
import {CandidateService} from '../../services/candidate/candidate.service';
import {map} from 'rxjs/operators';
import {RequestPropsService} from '../../services/requestProps/requestProps.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert/alert.service';

@Component({
  selector: 'app-create-candidate',
  templateUrl: './create-candidate.component.html',
  styleUrls: ['./create-candidate.component.css']
})
export class CreateCandidateComponent implements OnInit {

  fileToUpload: File = null;
  candidateName = '';
  profiles: string[];
  createForm: FormGroup;

  constructor(private candidateService: CandidateService,
              private requestPropsService: RequestPropsService,
              private formBuilder: FormBuilder,
              private router: Router,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.requestPropsService.getRequestProfiles()
      .pipe(map(dao => dao.profiles.map(p => p.profile)))
      .subscribe(result => {
        this.profiles = result;
      }, error => {
        console.log(error);
      });
    this.createForm = this.formBuilder.group({
      name: this.formBuilder.control(''),
      info: this.formBuilder.control(''),
      profiles: this.formBuilder.control([])
    });
  }

  handleFileInput(files: FileList) {
    // Check if filesList size == 1
    this.fileToUpload = files.item(0);
  }

  onSubmit() {
    if (!this.createForm.value.name || this.fileToUpload === null) {
      this.alertService.warn('Please insert a name and a CV.');
    } else {
      const body: { name: string, cv: File, info?: string, profiles?: string } = {
        name: this.createForm.value.name,
        cv: this.fileToUpload
      };
      if (this.createForm.value.info !== '') {
        body.info = this.createForm.value.info;
      }
      if (this.createForm.value.profiles.length > 0) {
        body.profiles = this.createForm.value.profiles;
      }
      this.candidateService.addCandidate(body)
        .subscribe(dao => {
          this.alertService.success('Candidate added to the system');
          this.router.navigate(['/candidates', dao.id]);
        }, error => {
          console.log(error);
        });
    }
  }
}
