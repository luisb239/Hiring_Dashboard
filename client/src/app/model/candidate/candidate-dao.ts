import { CandidateDetailsDao } from './candidate-details-dao';
import {CandidateProcessDao} from './candidate-process-dao';
import {ProfileDao} from '../requestProps/profiles-dao';

export class CandidateDao {
    candidate: CandidateDetailsDao;
    profiles: ProfileDao[];
    processes: CandidateProcessDao[];
}
