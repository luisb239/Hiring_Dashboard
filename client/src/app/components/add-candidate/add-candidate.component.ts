import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Candidate} from '../../model/candidate/candidate';
import {CandidateService} from '../../services/candidate/candidate.service';
import {RequestPropsService} from 'src/app/services/requestProps/requestProps.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ProcessService} from '../../services/process/process.service';
import {map} from 'rxjs/operators';
import {RequestService} from '../../services/request/request.service';

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
  existingCandidates: number[];

  constructor(
    public activeModal: NgbActiveModal,
    private candidateService: CandidateService,
    private requestPropsService: RequestPropsService,
    private processService: ProcessService,
    private requestService: RequestService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.requestService.getRequest(this.requestId)
      .pipe(map(dao => {
        return dao.processes
          .map(processDao => processDao.candidate.id);
      }))
      .subscribe(result => {
        this.existingCandidates = result;
        this.getAllCandidates();
      }, error => console.log(error));

    this.requestPropsService.getRequestProfiles()
      .pipe(map(dao => dao.profiles.map(p => p.profile)))
      .subscribe(result => {
        this.profiles = result;
      }, error => {
        console.log(error);
      });

    this.candidateForm = this.formBuilder.group({
      candidatesIdx: this.formBuilder.array([])
    });

    this.filterForm = this.formBuilder.group(
      {
        profiles: this.formBuilder.control([]),
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
    const values = this.candidateForm.value.candidatesIdx;
    console.log(values);
    values.forEach(idx => {
      this.processService.createProcess(this.requestId, this.candidates[idx].id)
        .subscribe(() => {
            alert('Candidates added to this request successfully!');
            this.activeModal.close('Close click');
            location.reload();
          }, error => {
            console.log(error);
          }
        );
    });
  }

  filterCandidates() {
    this.candidateService.getAllCandidatesWithQueries(this.filterForm.value.profiles, this.filterForm.value.available)
      .pipe(map(dao => dao.candidates.filter(
        candidate => !this.existingCandidates.includes(candidate.id)
      ).map(c =>
        new Candidate(c.name, c.id, c.profileInfo, c.available, c.cvFileName))))
      .subscribe(result => {
        this.candidates = result;
      }, error => {
        console.log(error);
      });
  }

  getAllCandidates() {
    this.candidateService.getAllCandidates()
      .pipe(
        map(dao => dao.candidates.filter(
          candidate => !this.existingCandidates.includes(candidate.id))
          .map(c =>
            new Candidate(c.name, c.id, c.profileInfo, c.available, c.cvFileName)
          )
        )
      )
      .subscribe(result => {
        this.candidates = result;
      }, error => {
        console.log(error);
      });
  }
}
