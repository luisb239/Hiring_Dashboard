import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ProcessPhase} from '../../model/process/process-phase';
import {PhaseAttribute} from '../../model/phase/phase-attribute';
import {Candidate} from 'src/app/model/candidate/candidate';
import {Process} from '../../model/process/process';
import {FormBuilder, FormControl} from '@angular/forms';
import {ProcessService} from '../../services/process/process.service';
import {CandidateService} from '../../services/candidate/candidate.service';
import {PhaseService} from '../../services/phase/phase.service';
import {ProcessPhaseService} from '../../services/process-phase/process-phase.service';
import {map} from 'rxjs/operators';
import {AlertService} from '../../services/alert/alert.service';
import {ErrorType} from '../../services/common-error';
import {PopupProps} from './popup-props';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit, OnDestroy {

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

  ngOnDestroy(): void {
    this.candidateProcessChanged.emit();
  }

  getCandidateAndProcessInfo() {
    this.getCandidateInfo();

    this.phaseService.getPhase(this.phaseName)
      .subscribe(phaseDao => {
        // Add phase properties to update Form Control
        phaseDao.infos.forEach(pi => {
          this.properties.updateForm.addControl(pi.name, new FormControl());
          this.properties.attributeTemplates.push(new PhaseAttribute(pi.name, pi.value.type));
        });
        this.processService.getProcess(this.requestId, this.candidateId)
          .subscribe(processDao => {
            const phase = processDao.phases.find(ph => ph.phase === this.phaseName);
            const phaseInfos = phase.infos || [];
            this.properties.attributeTemplates.forEach(at => {
              const info = phaseInfos.find(i => i.name === at.name);
              if (!info) {
                return;
              }
              at.value = info.value;
              this.properties.updateForm.get(at.name).setValue(at.value);
            });
            // Add status to form
            this.properties.updateForm.addControl('status', new FormControl(processDao.status));
            // Add unavailable reasons to form
            this.properties.updateForm.addControl('unavailableReason', new FormControl(processDao.unavailableReason));

            this.properties.process = new Process(processDao.status, processDao.unavailableReason, processDao.timestamp);

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

            const phaseDetails = processDao.phases.find(p => p.phase === processDao.currentPhase);
            this.properties.phase = new ProcessPhase(phaseDetails.phase, phaseDetails.notes === null ? '' : phaseDetails.notes);

          });
      });
  }

  updateCandidate() {
    const attributeArray = [];
    this.properties.attributeTemplates.forEach(att => {
        const res = this.properties.updateForm.value[att.name];
        const newAttr = this.properties.newAttributeTemplates[att.name];
        if ((res !== null && res !== att.value) || (res !== null && newAttr && (newAttr !== res))) {
          attributeArray.push({name: att.name, value: res});
        }
      }
    );
    const body: { status?: string, unavailableReason?: string, infos?: any[], timestamp?: string } = {};

    if (this.properties.process.status !== this.properties.updateForm.value.status ||
      (this.properties.newProcess && this.properties.newProcess.status !== this.properties.process.status)) {
      body.status = this.properties.updateForm.value.status;
    }

    if (this.properties.updateForm.value.unavailableReason) {
      if (this.properties.process.unavailableReason !== this.properties.updateForm.value.unavailableReason
        || (this.properties.newProcess && this.properties.newProcess.unavailableReason !== this.properties.process.unavailableReason)) {
        body.unavailableReason = this.properties.updateForm.value.unavailableReason;
      }
    }

    if (attributeArray.length > 0) {
      body.infos = attributeArray;
    }

    body.timestamp = this.properties.newProcess ? this.properties.newProcess.timestamp : this.properties.process.timestamp;

    this.processService.updateProcess(this.requestId, this.candidateId, body)
      .subscribe((newTimestamp) => {
        if (this.properties.phase.notes !== this.properties.updateForm.value.phaseNotes
          || (this.properties.newPhaseNotes && this.properties.newPhaseNotes !== this.properties.updateForm.value.phaseNotes)) {
          this.processPhaseService.updateProcessPhaseNotes(
            this.requestId,
            this.candidateId,
            this.properties.phase.phase,
            this.properties.updateForm.value.phaseNotes,
            newTimestamp
          ).subscribe(() => {
            this.closeModal();
          }, error => {
            this.handleConflict(error);
          });
        } else {
          this.closeModal();
        }
      }, error => {
        this.handleConflict(error);
      });
  }

  handleConflict(error) {
    if (error === ErrorType.CONFLICT) {
      this.alertService.error('This process note have already been updated.');
      this.alertService.info('Refreshing process details...');
      this.alertService.warn('The red value(s) indicates what has been updated by another user.' +
        ' Merge your information or close this page and overwrite your values.',
        {autoClose: false, keepAfterRouteChange: false});
    }
    this.getNewValues();
  }

  closeModal() {
    this.alertService.success('Updated Candidate successfully!');
    this.activeModal.close('Close click');
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
      timestamp: this.properties.candidate.timestamp
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
        dao.candidate.cvFileName,
        dao.candidate.cvVersionId,
        dao.candidate.timestamp)))
      .subscribe(result => {
        this.properties.candidate = result;
      }, error => {
        if (error === ErrorType.NOT_FOUND) {
          this.alertService.error('Candidate does not exist.');
        }
      });
  }

  isEqualAttributeTemplate(attributeName: string) {
    const elem = this.properties.attributeTemplates.find(att => att.name === attributeName);
    return elem.value === this.properties.newAttributeTemplates[attributeName];
  }

  private getNewValues() {
    this.properties.conflict = true;
    this.getCandidateInfo();
    this.processService.getProcess(this.requestId, this.candidateId)
      .subscribe(dao => {
        this.properties.newProcess = new Process(dao.status, dao.unavailableReason, dao.timestamp);
        const phaseNotes = dao.phases.find(p => p.phase === dao.currentPhase).notes;
        this.properties.newPhaseNotes = phaseNotes === null ? '' : phaseNotes;
        this.phaseService.getPhase(this.phaseName)
          .subscribe(phaseDao => {
            this.properties.newAttributeTemplates = {};
            phaseDao.infos
              .forEach(pi => {
                this.properties.newAttributeTemplates[pi.name] = new PhaseAttribute(pi.name, pi.value.type);
              });
            Object.keys(this.properties.newAttributeTemplates)
              .forEach(at => this.properties.newAttributeTemplates[at] = dao.phases
                .find(phase => phase.phase === this.phaseName).infos
                .find(i => i.name === at).value
              );
          });
      });
  }
}
