import { CandidateDetailsDao } from './candidate-details-dao';
import {ProfileDao} from '../profile/profile-dao';
import {CandidateProcessDao} from './candidate-process-dao';

export class CandidateDao {
    candidate: CandidateDetailsDao;
    profiles: ProfileDao[];
    processes: CandidateProcessDao[];
}
