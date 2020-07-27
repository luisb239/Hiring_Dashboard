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
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.properties.candidateId = +(history.state.candidateId || this.router.url.split('/')[2]);
    this.properties.requestId = history.state.requestId ? +history.state.requestId : undefined;

    this.candidateService.getCandidateById(this.properties.candidateId)
      .subscribe(dao => {
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
      }, error => {
        console.log(error);
      });

    this.requestPropsService.getRequestProfiles()
      .pipe(map(dao => dao.profiles.map(p => p.profile)))
      .subscribe(result => {
        this.properties.profiles = result;
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

}
