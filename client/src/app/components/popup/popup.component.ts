import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProcessPhase } from '../../model/process/process-phase';
import { PhaseAttribute } from '../../model/phase/phase-attribute';
import { Candidate } from 'src/app/model/candidate/candidate';
import { Process } from '../../model/process/process';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProcessService } from '../../services/process/process.service';
import { CandidateService } from '../../services/candidate/candidate.service';
import { PhaseService } from '../../services/phase/phase.service';
import { ProcessPhaseService } from '../../services/process-phase/process-phase.service';
import { map } from 'rxjs/operators';
import { AlertService } from '../../services/alert/alert.service';
import { ErrorType } from '../../services/common-error';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  @Input()
  requestId: number;
  @Input()
  candidateId: number;
  @Input()
  phaseName: string;

  @Output() candidateProcessChanged = new EventEmitter();

  statusList: string[];
  reasons: string[];
  process: Process;
  phase: ProcessPhase;
  candidate: Candidate;
  attributeTemplates: PhaseAttribute[] = [];
  updateForm: FormGroup;
  timestamp: Date;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private processService: ProcessService,
    private candidateService: CandidateService,
    private phaseService: PhaseService,
    private processPhaseService: ProcessPhaseService,
    private alertService: AlertService
  ) {
    this.updateForm = this.formBuilder.group(
      {
        phaseNotes: this.formBuilder.control('')
      }
    );
  }

  ngOnInit(): void {
    this.getCandidateAndProcessInfo();
  }

  getCandidateAndProcessInfo() {
    this.getCandidateInfo();
    this.processService.getProcess(this.requestId, this.candidateId)
      .subscribe(dao => {
        this.updateForm.addControl('status', new FormControl(dao.status));
        this.updateForm.addControl('unavailableReason', new FormControl(dao.unavailableReason));
        this.process = new Process(dao.status, dao.unavailableReason);

        this.processService.getReasons()
          .subscribe(reasonDao => {
            this.reasons = reasonDao.unavailableReasons
              .filter(res => res.unavailableReason !== this.process.unavailableReason)
              .map(res => res.unavailableReason);
          }, () => {
            this.alertService.error('Unexpected server error. Refresh and try again.');
          });

        this.processService.getStatus()
          .subscribe(statusDao => {
            this.statusList = statusDao.status
              .filter(stat => stat.status !== this.process.status)
              .map(stat => stat.status);
          }, () => {
            this.alertService.error('Unexpected server error. Refresh and try again.');
          });

        const phaseDetails = dao.phases.find(p => p.phase === dao.currentPhase);
        this.phase = new ProcessPhase(phaseDetails.phase,
          phaseDetails.notes === null ? '' : phaseDetails.notes);
      }, () => {
        this.alertService.error('Unexpected server error. Refresh and try again.');
      });

    this.phaseService.getPhase(this.phaseName)
      .subscribe(phaseDao => {
        phaseDao
          .infos.forEach(pi => {
            this.updateForm.addControl(pi.name, new FormControl());
            this.attributeTemplates.push(new PhaseAttribute(pi.name, pi.value.name, pi.value.type));
          }
          );

        this.processService.getProcess(this.requestId, this.candidateId)
          .subscribe(processDao => {
            this.attributeTemplates
              .forEach(at => at.value = processDao.phases
                .find(phase => phase.phase === this.phaseName).infos
                .find(i => i.name === at.name).value);
          }, () => {
            this.alertService.error('Unexpected server error. Refresh and try again.');
          });
      }, () => {
        this.alertService.error('Unexpected server error. Refresh and try again.');
      });
  }

  updateCandidate() {
    const attributeArray = [];
    this.attributeTemplates.forEach(att => {
      const res = this.updateForm.value[att.name];
      if (res !== null && res !== att.value) {
        attributeArray.push({ name: att.name, value: res });
      }
    }
    );
    const body: { status?: string, unavailableReason?: string, infos?: any[], timestamp?: Date } = {};

    if (this.process.status !== this.updateForm.value.status) {
      body.status = this.updateForm.value.status;
    }

    if (this.process.unavailableReason !== this.updateForm.value.unavailableReason) {
      body.unavailableReason = this.updateForm.value.unavailableReason;
    }

    if (attributeArray.length > 0) {
      body.infos = attributeArray;
    }

    if (body !== {}) {
      body.timestamp = this.timestamp;
      this.processService.updateProcess(this.requestId, this.candidateId, body)
        .subscribe(() => {
          this.alertService.success('Updated Candidate successfully!');
          this.activeModal.close('Close click');
          this.candidateProcessChanged.emit(`Candidate ${this.candidateId} process has been updated`);
        }, error => {
          if (error === ErrorType.PRECONDITION_FAILED) {
            this.alertService.error('This process has already been updated by another user.');
            this.alertService.info('Refreshing process details...');
            this.getCandidateAndProcessInfo();
          } else {
            this.alertService.error('Unexpected server error. Refresh and try again.');
          }
        }
        );
    }
    if (this.phase.notes !== this.updateForm.value.phaseNotes) {
      this.processPhaseService.updateProcessPhaseNotes(
        this.requestId,
        this.candidateId,
        this.phase.phase,
        this.updateForm.value.phaseNotes,
        this.timestamp)
        .subscribe(() => {
        }, error => {
          if (error === ErrorType.PRECONDITION_FAILED) {
            this.alertService.error('This process has already been updated by another user.');
            this.alertService.info('Refreshing process details...');
            this.getCandidateAndProcessInfo();
          } else {
            this.alertService.error('Unexpected server error. Refresh and try again.');
          }
        });
    }
  }

  downloadCv() {
    this.candidateService.downloadCandidateCv(this.candidateId)
      .subscribe(data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = this.candidate.cv;
        link.click();
      }, () => {
        this.alertService.error('Unexpected server error. Refresh and try again.');
      });
  }

  changeAvailable() {
    const updateBody = {
      cv: null,
      profileInfo: this.candidate.profileInfo,
      available: !this.candidate.available
    };
    this.candidateService.updateCandidate(updateBody, this.candidateId)
      .subscribe(() => {
        this.getCandidateInfo();
      }, () => {
        this.alertService.error('Unexpected server error. Refresh and try again.');
      });
  }

  getCandidateInfo() {
    this.candidateService.getCandidateById(this.candidateId)
      .pipe(map(dao => new Candidate(
        dao.candidate.name,
        dao.candidate.id,
        dao.candidate.profileInfo,
        dao.candidate.available,
        dao.candidate.cvFileName)))
      .subscribe(result => {
        this.timestamp = new Date();
        this.candidate = result;
      }, error => {
        if (error === ErrorType.NOT_FOUND) {
          this.alertService.error('Candidate does not exist.');
        } else {
          this.alertService.error('Unexpected server error. Refresh and try again.');
        }
      });
  }
}
