import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ProcessPhase} from '../../model/process/process-phase';
import {PhaseAttribute} from '../../model/phase/phase-attribute';
import {Candidate} from 'src/app/model/candidate/candidate';
import {Process} from '../../model/process/process';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ProcessService} from '../../services/process/process.service';
import {CandidateService} from '../../services/candidate/candidate.service';
import {PhaseService} from '../../services/phase/phase.service';
import {ProcessPhaseService} from '../../services/process-phase/process-phase.service';
import {map} from 'rxjs/operators';
import {AlertService} from '../../services/alert/alert.service';
import {ErrorType} from '../../services/common-error';
import * as moment from 'moment';
import {PopupProps} from './popup-props';

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

  public properties: PopupProps = new PopupProps();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private processService: ProcessService,
    private candidateService: CandidateService,
    private phaseService: PhaseService,
    private processPhaseService: ProcessPhaseService,
    private alertService: AlertService
  ) {
    this.properties.updateForm = this.formBuilder.group(
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
        this.properties.updateForm.addControl('status', new FormControl(dao.status));
        this.properties.updateForm.addControl('unavailableReason', new FormControl(dao.unavailableReason));
        this.properties.process = new Process(dao.status, dao.unavailableReason);

        this.processService.getReasons()
          .subscribe(reasonDao => {
            this.properties.reasons = reasonDao.unavailableReasons
              .filter(res => res.unavailableReason !== this.properties.process.unavailableReason)
              .map(res => res.unavailableReason);
          });

        this.processService.getStatus()
          .subscribe(statusDao => {
            this.properties.statusList = statusDao.status
              .filter(stat => stat.status !== this.properties.process.status)
              .map(stat => stat.status);
          });

        const phaseDetails = dao.phases.find(p => p.phase === dao.currentPhase);
        this.properties.phase = new ProcessPhase(phaseDetails.phase,
          phaseDetails.notes === null ? '' : phaseDetails.notes);
      });

    this.phaseService.getPhase(this.phaseName)
      .subscribe(phaseDao => {
        phaseDao.infos
          .forEach(pi => {
              const phaseForm = this.properties.updateForm.get(pi.name);
              if (!phaseForm) {
                this.properties.updateForm.addControl(pi.name, new FormControl());
                this.properties.attributeTemplates.push(new PhaseAttribute(pi.name, pi.value.type));
              }
            }
          );

        this.processService.getProcess(this.requestId, this.candidateId)
          .subscribe(processDao => {
            this.properties.attributeTemplates
              .forEach(at => at.value = processDao.phases
                .find(phase => phase.phase === this.phaseName).infos
                .find(i => i.name === at.name).value
              );
          });
      });
  }

  updateCandidate() {
    const attributeArray = [];
    this.properties.attributeTemplates.forEach(att => {
        const res = this.properties.updateForm.value[att.name];
        if (res !== null && res !== att.value) {
          attributeArray.push({name: att.name, value: res});
        }
      }
    );
    const body: { status?: string, unavailableReason?: string, infos?: any[], timestamp?: string } = {};

    if (this.properties.process.status !== this.properties.updateForm.value.status) {
      body.status = this.properties.updateForm.value.status;
    }

    if (this.properties.process.unavailableReason !== this.properties.updateForm.value.unavailableReason) {
      body.unavailableReason = this.properties.updateForm.value.unavailableReason;
    }

    if (attributeArray.length > 0) {
      body.infos = attributeArray;
    }

    body.timestamp = this.properties.timestamp;

    this.processService.updateProcess(this.requestId, this.candidateId, body)
      .pipe(map(() => {
        this.properties.timestamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
        if (this.properties.phase.notes !== this.properties.updateForm.value.phaseNotes) {
          this.processPhaseService.updateProcessPhaseNotes(
            this.requestId,
            this.candidateId,
            this.properties.phase.phase,
            this.properties.updateForm.value.phaseNotes,
            this.properties.timestamp).subscribe(() => {
          });
        }
      }))
      .subscribe(() => {
          this.alertService.success('Updated Candidate successfully!');
          this.activeModal.close('Close click');
          this.candidateProcessChanged.emit(`Candidate ${this.candidateId} process has been updated`);
        }, error => {
          if (error === ErrorType.CONFLICT) {
            this.alertService.error('This process has already been updated.');
            this.alertService.info('Refreshing process details...');
            this.getNewValues();
          }
        }
      );
  }

  downloadCv() {
    this.candidateService.downloadCandidateCv(this.candidateId)
      .subscribe(data => {
        const blob = new Blob([data], {type: 'application/pdf'});
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = this.properties.candidate.cv;
        link.click();
      });
  }

  changeAvailable() {
    const updateBody = {
      cv: null,
      profileInfo: this.properties.candidate.profileInfo,
      available: !this.properties.candidate.available,
      timestamp: this.properties.timestamp
    };
    this.candidateService.updateCandidate(updateBody, this.candidateId)
      .subscribe(() => {
        this.getCandidateInfo();
      }, error => {
        if (error === ErrorType.CONFLICT) {
          this.alertService.error('This process has already been updated by another user.');
          this.alertService.info('Refreshing process details...');
          this.getNewValues();
        }
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
        this.properties.timestamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
        this.properties.candidate = result;
      }, error => {
        if (error === ErrorType.NOT_FOUND) {
          this.alertService.error('Candidate does not exist.');
        }
      });
  }

  private getNewValues() {
    this.properties.conflict = true;
    this.getCandidateInfo();
    this.processService.getProcess(this.requestId, this.candidateId)
      .subscribe(dao => {
        this.properties.newStatus = dao.status;
        this.properties.newUnavailableReasons = dao.unavailableReason;
        this.properties.newProcess = new Process(dao.status, dao.unavailableReason);

        const phaseNotes = dao.phases.find(p => p.phase === dao.currentPhase).notes;
        this.properties.newPhaseNotes = phaseNotes === null ? '' : phaseNotes;
        this.phaseService.getPhase(this.phaseName)
          .subscribe(phaseDao => {
            this.properties.newAttributeTemplates = {};
            phaseDao.infos
              .forEach(pi => {
                  this.properties.newAttributeTemplates[pi.name] = new PhaseAttribute(pi.name, pi.value.type);
                }
              );
            Object.keys(this.properties.newAttributeTemplates)
              .forEach(at => this.properties.newAttributeTemplates[at] = dao.phases
                .find(phase => phase.phase === this.phaseName).infos
                .find(i => i.name === at).value
              );
          });
      });
  }
}
