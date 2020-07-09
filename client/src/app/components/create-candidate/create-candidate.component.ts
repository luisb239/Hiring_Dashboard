import {Component, OnInit} from '@angular/core';
import {CandidateService} from '../../services/candidate/candidate.service';
import {map} from 'rxjs/operators';
import {RequestPropsService} from '../../services/requestProps/requestProps.service';
import {FormBuilder, FormGroup} from '@angular/forms';

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
              private formBuilder: FormBuilder) {
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
      cv: this.formBuilder.control(''),
      info: this.formBuilder.control(''),
      profiles: this.formBuilder.control([])
    });
  }

  handleFileInput(files: FileList) {
    // Check if filesList size == 1
    this.fileToUpload = files.item(0);
  }

  onSubmit() {
    const body: { name: string, cv: string, info?: string, profiles?: string } = {name: this.createForm.value.name,
      cv: this.createForm.value.cv};
    if (this.createForm.value.info !== '') { body.info = this.createForm.value.info; }
    if (this.createForm.value.profiles.length() > 0) { body.profiles = this.createForm.value.profiles; }
    this.candidateService.addCandidate(this.candidateName, this.fileToUpload)
      .subscribe(data => {
        alert('Candidate added to the system');
      }, error => {
        console.log(error);
      });
  }
}
