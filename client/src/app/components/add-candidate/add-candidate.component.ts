import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Candidate} from '../../model/candidate/candidate';
import {CandidateService} from '../../services/candidate/candidate.service';
import {RequestPropsService} from 'src/app/services/requestProps/requestProps.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css']
})
export class AddCandidateComponent implements OnInit {

  @Input() requestId: number;
  candidates: Candidate[];
  profiles: string[];
  candidateForm: FormGroup;
  filterForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private candidateService: CandidateService,
    private requestPropsService: RequestPropsService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.candidateService.getAllCandidates()
      .subscribe(dao => {
        this.candidates = dao.candidates.map(c =>
          new Candidate(c.name, c.id, c.profileInfo, c.available, c.cv));
      }, error => {
        console.log(error);
      });
    this.requestPropsService.getRequestProfiles()
      .subscribe(dao => {
        this.profiles = dao.profiles.map(p => p.profile);
      }, error => {
        console.log(error);
      });

    this.candidateForm = this.formBuilder.group({
      candidatesIdx: this.formBuilder.array([])
    });

    this.filterForm = this.formBuilder.group(
      {
        profiles: this.formBuilder.array([]),
        available: this.formBuilder.control(false)
      }
    );
  }

  onChange(idx: number, event: any) {
    const array = this.candidateForm.controls.candidatesIdx as FormArray;

    if (event.target.checked) {
      array.push(new FormControl(idx));
    } else {
      const index = array.controls.findIndex(x => x.value === idx);
      array.removeAt(index);
    }
  }

  onSubmit() {
    // const values = this.candidateForm.value;
    // values.forEach(idx => {
    //   this.processService.addCanditateToRequest(this.requestId, this.candidates[idx])
    //     .subscribe();
    // });
  }
}
