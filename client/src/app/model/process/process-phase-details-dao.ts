import {ProcessPhaseInfoDao} from './process-phase-info-dao';

export class ProcessPhaseDetailsDao {
  phase: string;
  startDate: string;
  updateDate: string;
  notes: string;
  infos: ProcessPhaseInfoDao[];
}
