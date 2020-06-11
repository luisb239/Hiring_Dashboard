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
import {PhaseAttribute} from '../../model/phase/phase-attribute';
import {PhaseInfo} from '../../model/phase/phase-info';
import {CandidateProcess} from '../../model/candidate/CandidateProcess';


@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit {

  candidateId: number;
  requestId: number;
  candidate: Candidate;
  currentRequest: Request;
  currentProcess: Process;
  allProcesses: Process[] = [];
  allRequests: Request[] = [];

  constructor(private candidateService: CandidateService,
              private requestService: RequestService,
              private processService: ProcessService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.candidateId = history.state.candidateId || this.router.url.split('/')[2];
    this.requestId = history.state.requestId || Number(localStorage.getItem('requestId'));
    localStorage.removeItem('requestId');
    localStorage.setItem('requestId', String(this.requestId));

    this.candidateService.getCandidateById(this.candidateId)
      .subscribe(dao => {
        const result = dao.candidate;
        this.candidate = new Candidate(result.name,
          result.id,
          result.profileInfo,
          result.available,
          result.cv,
          dao.profiles.map(pi => pi.profile),
          dao.processes.map(proc => new CandidateProcess(proc.status, proc.requestId)));
        this.candidate.processes.forEach(process => {
          if (process.requestId !== this.requestId) {
            this.requestService.getRequest(process.requestId)
              .subscribe(requestDao => {
                const request = requestDao.request;
                this.allRequests.push(new Request(new RequestList(
                  request.id,
                  request.workflow,
                  request.progress,
                  request.state,
                  request.description
                ), [], []));
              }, error => console.log(error));
            this.processService.getProcess(process.requestId, this.candidateId)
              .subscribe(processDao => {
                  this.allProcesses.push(new Process(processDao.status,
                    processDao.unavailableReasons,
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
          }
        });
      }, error => {
        console.log(error);
      });

    if (this.requestId) {
      this.requestService.getRequest(this.requestId)
        .subscribe(dao => {
          const requestDao = dao.request;
          this.currentRequest = new Request(new RequestList(
            requestDao.id,
            requestDao.workflow,
            requestDao.progress,
            requestDao.state,
            requestDao.description
          ), [], []);
        }, error => console.log(error));
      this.processService.getProcess(this.requestId, this.candidateId)
        .subscribe(dao => {
          this.currentProcess = new Process(dao.status, dao.unavailableReasons,
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

  clear() {
    localStorage.removeItem('requestId');
  }

}
