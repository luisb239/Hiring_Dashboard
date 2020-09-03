import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Candidate} from '../../model/candidate/candidate';
import {CandidateService} from '../../services/candidate/candidate.service';
import {RequestPropsService} from 'src/app/services/requestProps/requestProps.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ProcessService} from '../../services/process/process.service';
import {map} from 'rxjs/operators';
import {RequestService} from '../../services/request/request.service';
import {RequestList} from '../../model/request/request-list';
import {AlertService} from '../../services/alert/alert.service';
import {ErrorType} from '../../services/common-error';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css']
})
export class AddCandidateComponent implements OnInit {

  @Input() request: RequestList;
  @Output() candidateAdded = new EventEmitter();
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
    private formBuilder: FormBuilder,
    private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.getRequestProcesses();

    this.requestPropsService.getRequestProfiles()
      .pipe(map(dao => dao.profiles.map(p => p.profile)))
      .subscribe(result => this.profiles = result);

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
    values.forEach(idx => {
      this.processService.createProcess(this.request.id, this.candidates[idx].id)
        .subscribe(() => {
            this.alertService.success('Candidates added to this request successfully!');
            this.activeModal.close('Close click');
            this.candidateAdded.emit();
          }, error => {
            if (error === ErrorType.CONFLICT) {
              this.alertService.error('This candidate has already been added to this request by another user.');
              this.alertService.info('Refreshing...');
              this.getRequestProcesses();
            }
          }
        );
    });
  }

  filterCandidates() {
    this.candidateService.find(null, null,
      {profiles: this.filterForm.value.profiles, available: this.filterForm.value.available})
      .pipe(map(candidates => candidates.filter(
        candidate => !this.existingCandidates.includes(candidate.id)).map(c =>
        new Candidate(c.name, c.id, c.profileInfo, c.available, c.cvFileName))))
      .subscribe(result => this.candidates = result);
  }

  getAllCandidates() {
    this.candidateService.find(null, null)
      .pipe(
        map(candidates => candidates.filter(
          candidate => !this.existingCandidates.includes(candidate.id)
        ).map(c => new Candidate(c.name, c.id, c.profileInfo, c.available, c.cvFileName)))
      ).subscribe(result => this.candidates = result);
  }

  getRequestProcesses() {
    this.requestService.getRequest(this.request.id)
      .pipe(map(dao => {
        return dao.processes
          .map(processDao => processDao.candidate.id);
      }))
      .subscribe(result => {
        this.existingCandidates = result;
        this.getAllCandidates();
      });
  }
}
