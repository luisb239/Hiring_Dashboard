import {Component, OnInit} from '@angular/core';
import {CandidateService} from '../../services/candidate/candidate.service';
import {Router} from '@angular/router';
import {Candidate} from 'src/app/model/candidate/candidate';
import {ProcessService} from '../../services/process/process.service';
import {Process} from '../../model/process/process';
import {ProcessPhase} from '../../model/process/process-phase';
import {RequestService} from '../../services/request/request.service';
import {Request} from '../../model/request/request';
import {RequestList} from '../../model/request/request-list';
import {PhaseInfo} from '../../model/phase/phase-info';
import {CandidateProcess} from '../../model/candidate/candidate-process';
import {CandidateDetailsProps} from './candidate-details-props';
import {map} from 'rxjs/operators';
import {RequestPropsService} from '../../services/requestProps/requestProps.service';
import {FormBuilder} from '@angular/forms';
import {AlertService} from 'src/app/services/alert/alert.service';
import {Buffer} from 'buffer';

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

    this.candidateService.getCandidateById(this.properties.candidateId)
      .subscribe(dao => {
        this.properties.timestamp = new Date();
        const result = dao.candidate;
        this.properties.candidate = new Candidate(result.name,
          result.id,
          result.profileInfo,
          result.available,
          result.cvFileName,
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
              }, error => console.log(error));

            this.processService.getProcess(process.requestId, this.properties.candidateId)
              .subscribe(processDao => {
                  this.properties.allProcesses.push(new Process(processDao.status,
                    processDao.unavailableReason,
                    processDao.phases.map(phase => new ProcessPhase(
                      phase.phase,
                      phase.startDate,
                      phase.updateDate,
                      phase.notes,
                      phase.infos.map(info => new PhaseInfo(info.name, info.value))
                    )))
                  );
                },
                error => {
                  console.log(error);
                });
          });

        this.getRequestProfiles();

        this.properties.infoForm = this.formBuilder.control(this.properties.candidate.profileInfo);
        this.properties.profilesForm = this.formBuilder.control('');
        this.properties.updateForm = this.formBuilder.group({
          info: this.properties.infoForm,
          profiles: this.properties.profilesForm
        });
      }, error => {
        console.log(error);
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
        }, error => console.log(error));

      this.processService.getProcess(this.properties.requestId, this.properties.candidateId)
        .subscribe(dao => {
          this.properties.currentProcess = new Process(dao.status, dao.unavailableReason,
            dao.phases.map(phase => new ProcessPhase(phase.phase,
              phase.startDate,
              phase.updateDate,
              phase.notes,
              phase.infos.map(info => new PhaseInfo(info.name, info.value)))));
        }, error => {
          console.log(error);
        });
    }
  }

  onSubmit() {
    const body = {
      id: this.properties.candidateId,
      cv: null,
      profileInfo: this.properties.candidate.profileInfo,
      available: this.properties.candidate.available,
      profiles: [],
      timestamp: this.properties.timestamp
    };
    body.id = this.properties.candidateId;
    if (this.properties.fileToUpload !== null) {
      body.cv = this.properties.fileToUpload;
    }
    if (this.properties.updateForm.value.info !== '') {
      body.profileInfo = this.properties.updateForm.value.info;
    }
    if (this.properties.updateForm.value.profiles.length > 0) {
      body.profiles = this.properties.updateForm.value.profiles;
    }
    body.available = this.properties.candidate.available;
    this.candidateService.updateCandidate(body)
      .subscribe(() => {
        this.alertService.success('Candidate Updated Successfully');
        this.updateCandidateComponent();
        this.properties.profilesForm.setValue('');
      }, error => {
        this.alertService.error(error);
      });
  }

  handleProfileDelete(profile: string) {
    const encodedProfile = Buffer.from(profile, 'binary').toString('base64');
    this.candidateService.removeCandidateProfile({id: this.properties.candidateId, profile: encodedProfile})
      .subscribe(() => {
        this.alertService.success('Profile removed successfully');
        this.updateCandidateComponent();
        this.properties.profilesForm.setValue('');
      }, error => {
        console.log(error);
      });
  }

  handleFileInput(files: FileList) {
    // Check if filesList size == 1
    this.properties.fileToUpload = files.item(0);
  }

  updateCandidateComponent() {
    this.candidateService.getCandidateById(this.properties.candidateId)
      .subscribe(candidateDao => {
        const result = candidateDao.candidate;
        this.properties.timestamp = new Date();
        this.properties.candidate = new Candidate(result.name,
          result.id,
          result.profileInfo,
          result.available,
          result.cvFileName,
          candidateDao.profiles.map(pi => pi.profile),
          candidateDao.processes.map(proc => new CandidateProcess(proc.status, proc.requestId)));
        this.getRequestProfiles();
      }, error => {
        console.log(error);
      });
  }

  downloadCv() {
    this.candidateService.downloadCandidateCv(this.properties.candidateId)
      .subscribe(data => {
        const blob = new Blob([data], {type: 'application/pdf'});
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = this.properties.candidate.cv;
        link.click();
      });
  }

  getRequestProfiles() {
    this.requestPropsService.getRequestProfiles()
      .pipe(map(profDao => profDao.profiles.map(p => p.profile)))
      .subscribe(profs => {
        this.properties.profiles =
          profs.filter(p => !this.properties.candidate.profiles.some(profile => profile === p));
      }, error => {
        console.log(error);
      });
  }

}
