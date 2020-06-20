import {Component, Input, OnInit} from '@angular/core';
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

  statusList: string[];
  reasons: string[];
  process: Process;
  phase: ProcessPhase;
  candidate: Candidate;
  attributeTemplates: PhaseAttribute[] = [];
  updateForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private formBuilder: FormBuilder,
              private processService: ProcessService,
              private candidateService: CandidateService,
              private phaseService: PhaseService,
              private processPhaseService: ProcessPhaseService
  ) {
    this.updateForm = this.formBuilder.group(
      {
        phaseNotes: this.formBuilder.control('')
      }
    );
  }

  ngOnInit(): void {

    this.candidateService.getCandidateById(this.candidateId)
      .subscribe(dao => {
        this.candidate = new Candidate(dao.candidate.name,
          dao.candidate.id,
          dao.candidate.profileInfo,
          dao.candidate.available,
          dao.candidate.cv);
      }, error => {
        console.log(error);
      });

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
          }, error => {
            console.log(error);
          });

        this.processService.getStatus()
          .subscribe(statusDao => {
            this.statusList = statusDao.status
              .filter(stat => stat.status !== this.process.status)
              .map(stat => stat.status);
          }, error => {
            console.log(error);
          });

        const phaseDetails = dao.phases.find(p => p.phase === dao.currentPhase);
        this.phase = new ProcessPhase(phaseDetails.phase,
          phaseDetails.startDate,
          phaseDetails.updateDate,
          phaseDetails.notes === null ? '' : phaseDetails.notes);
      }, error => {
        console.log(error);
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
          }, error => {
            console.log(error);
          });
      }, error => {
        console.log(error);
      });
  }

  updateCandidate() {
    const attributeArray = [];
    this.attributeTemplates.forEach(att => {
        const res = this.updateForm.value[att.name];
        if (res !== null && res !== att.value) {
          attributeArray.push({name: att.name, value: res});
        }
      }
    );
    const body: { status?: string, unavailableReason?: string, infos?: any[] } = {};

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
      this.processService.updateProcess(
        this.requestId,
        this.candidateId,
        body
      ).subscribe(dao => {
        }, error => {
          console.log(error);
        }
      );
    }
    if (this.phase.notes !== this.updateForm.value.phaseNotes) {
      this.processPhaseService.updateProcessPhaseNotes(
        this.requestId,
        this.candidateId,
        this.phase.phase,
        this.updateForm.value.phaseNotes
      ).subscribe(dao => {
      }, error => {
        console.log(error);
      });
    }

    this.candidateService.updateCandidate(this.candidate)
      .subscribe(dao => {
        alert('Updated Candidate successfully!');
      }, error => {
        console.log(error);
      });
  }
}
