import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../services/candidate/candidate.service';
import { Router } from '@angular/router';
import { Candidate } from 'src/app/model/candidate/candidate';
import { ProcessService } from '../../services/process/process.service';
import { Process } from '../../model/process/process';
import { ProcessPhase } from '../../model/process/process-phase';
import { RequestService } from '../../services/request/request.service';
import { Request } from '../../model/request/request';
import { RequestList } from '../../model/request/request-list';
import { PhaseInfo } from '../../model/phase/phase-info';
import { CandidateProcess } from '../../model/candidate/candidate-process';
import { CandidateDetailsProps } from './candidate-details-props';
import { map } from 'rxjs/operators';
import { RequestPropsService } from '../../services/requestProps/requestProps.service';
import { FormBuilder } from '@angular/forms';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Buffer } from 'buffer';
import { ErrorType } from '../../services/common-error';
import * as moment from 'moment';

@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit {

  properties: CandidateDetailsProps = new CandidateDetailsProps();

  constructor(
    private candidateService: CandidateService,
    private requestService: RequestService,
    private processService: ProcessService,
    private requestPropsService: RequestPropsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.properties.candidateId = +(history.state.candidateId || this.router.url.split('/')[2]);
    this.properties.requestId = history.state.requestId ? +history.state.requestId : undefined;
    // this.properties.conflict = false;
    this.candidateService.getCandidateById(this.properties.candidateId)
      .subscribe(dao => {
        this.properties.timestamp = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS');
        const result = dao.candidate;
        this.properties.candidate = new Candidate(result.name,
          result.id,
          result.profileInfo,
          result.available,
          result.cvFileName,
          result.cvVersionId,
          dao.profiles.map(pi => pi.profile),
          dao.processes.map(proc => new CandidateProcess(proc.status, proc.requestId)));
        this.properties.candidate.processes.filter(process => process.requestId !== this.properties.requestId)
          .forEach(process => {
            this.requestService.getRequest(process.requestId)
              .subscribe(requestDao => {
                const request = requestDao.request;
                this.properties.allRequests.push(new Request(new RequestList(
                  request.id,
                  request.workflow,
                  request.progress,
                  request.state,
                  request.description
                ), [], []));
              });

            this.processService.getProcess(process.requestId, this.properties.candidateId)
              .subscribe(processDao => {
                this.properties.allProcesses.push(new Process(processDao.status,
                  processDao.unavailableReason,
                  processDao.phases.map(phase => new ProcessPhase(
                    phase.phase,
                    phase.notes,
                    phase.infos.map(info => new PhaseInfo(info.name, info.value))
                  )))
                );
              });
          });

        this.getRequestProfiles();

        this.properties.infoForm = this.formBuilder.control(this.properties.candidate.profileInfo
          ? this.properties.candidate.profileInfo : '');
        this.properties.profilesForm = this.formBuilder.control('');
        this.properties.updateForm = this.formBuilder.group({
          info: this.properties.infoForm,
          profiles: this.properties.profilesForm
        });
      });

    if (this.properties.requestId) {
      this.requestService.getRequest(this.properties.requestId)
        .subscribe(dao => {
          const requestDao = dao.request;
          this.properties.currentRequest = new Request(new RequestList(
            requestDao.id,
            requestDao.workflow,
            requestDao.progress,
            requestDao.state,
            requestDao.description
          ), [], []);
        });

      this.processService.getProcess(this.properties.requestId, this.properties.candidateId)
        .subscribe(dao => {
          this.properties.currentProcess = new Process(dao.status, dao.unavailableReason,
            dao.phases.map(phase => new ProcessPhase(phase.phase,
              phase.notes,
              phase.infos.map(info => new PhaseInfo(info.name, info.value)))));
        });
    }
  }

  onSubmit() {
    this.properties.candidate.profileInfo = this.properties.updateForm.value.info;
    const body = {
      cv: this.properties.fileToUpload !== null ? this.properties.fileToUpload : null,
      profileInfo: this.properties.candidate.profileInfo,
      available: this.properties.candidate.available,
      profiles: this.properties.updateForm.value.profiles.length > 0 ?
        this.properties.updateForm.value.profiles : null,
      timestamp: this.properties.timestamp
    };
    this.candidateService.updateCandidate(body, this.properties.candidateId)
      .subscribe(() => {
        this.alertService.success('Candidate Updated Successfully');
        this.properties.profilesForm.setValue('');
        this.properties.fileToUpload = null;
        this.updateCandidateComponent(false);
      }, error => {
        if (error === ErrorType.CONFLICT) {
          this.alertService.error('This candidate has already been updated.');
          this.alertService.info('Refreshing...');
          this.alertService.warn('The red value indicates the new profile information written by another user.' +
            'Merge your information or refresh this page to override your information.',
            {autoClose: false, keepAfterRouteChange: true});
          // this.properties.conflict = true;
          this.updateCandidateComponent(true);
        }
      });
  }

  handleProfileDelete(profile: string) {
    const encodedProfile = Buffer.from(profile, 'binary').toString('base64');
    this.candidateService.removeCandidateProfile({ id: this.properties.candidateId, profile: encodedProfile })
      .subscribe(() => {
        this.alertService.success('Profile removed successfully');
        this.updateCandidateComponent(false);
      }, error => {
        if (error === ErrorType.NOT_FOUND) {
          this.alertService.error('This profile has already been deleted.');
          this.alertService.info('Refreshing...');
          this.updateCandidateComponent(true);
        }
      });
  }

  handleFileInput(files: FileList) {
    // Check if filesList size == 1
    this.properties.fileToUpload = files.item(0);
  }

  updateCandidateComponent(conflict: boolean) {
    this.candidateService.getCandidateById(this.properties.candidateId)
      .subscribe(candidateDao => {
        this.properties.newCandidate = null;
        const result = candidateDao.candidate;
        this.properties.timestamp = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS');
        const cand = new Candidate(result.name,
          result.id,
          result.profileInfo,
          result.available,
          result.cvFileName,
          result.cvVersionId,
          candidateDao.profiles.map(pi => pi.profile),
          candidateDao.processes.map(proc => new CandidateProcess(proc.status, proc.requestId)));
        if (conflict) {
          this.properties.newCandidate = cand;
        } else {
          this.properties.candidate = cand;
        }
        /* if (this.properties.newCandidate.profileInfo &&
          this.properties.newCandidate.profileInfo !== this.properties.candidate.profileInfo) {
          this.properties.conflict = true;
        } */
        this.getRequestProfiles();
        this.properties.infoForm.setValue(this.properties.candidate.profileInfo
          ? this.properties.candidate.profileInfo : '');
        this.properties.profilesForm.setValue('');
      });
  }

  downloadCv() {
    this.candidateService.downloadCandidateCv(this.properties.candidateId)
      .subscribe(data => {
        if (data.versionId !== this.properties.candidate.cvVersionId) {
          // Conflict with the cvs
          this.alertService.error('The cv you are trying to download is outdated. Please refresh the page.');
          return;
        }
        const blob = new Blob([data.blob], {type: 'application/pdf'});
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = data.filename;
        link.click();
      });
  }

  getRequestProfiles() {
    this.requestPropsService.getRequestProfiles()
      .pipe(map(profDao => profDao.profiles.map(p => p.profile)))
      .subscribe(profs => {
        if (this.properties.newCandidate) {
          this.properties.profiles =
            profs.filter(p => !this.properties.newCandidate.profiles.some(profile => profile === p));
        } else {
          this.properties.profiles =
            profs.filter(p => !this.properties.candidate.profiles.some(profile => profile === p));
        }
      });
  }

}
