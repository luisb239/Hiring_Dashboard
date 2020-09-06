import {Process} from '../../model/process/process';
import {ProcessPhase} from '../../model/process/process-phase';
import {Candidate} from '../../model/candidate/candidate';
import {PhaseAttribute} from '../../model/phase/phase-attribute';
import {FormGroup} from '@angular/forms';

export class PopupProps {
  statusList: string[];
  reasons: string[];
  process: Process;
  phase: ProcessPhase;
  candidate: Candidate;
  attributeTemplates: PhaseAttribute[] = [];
  newProcess: Process;
  newPhaseNotes: string;
  newAttributeTemplates: any = {};
  updateForm: FormGroup;
  conflict: boolean;
}
