import { CandidateDetailsDao } from './candidate-details-dao';
import {CandidateProcessDao} from './candidate-process-dao';
import {ProfilesDao} from '../requestProps/profiles-dao';

export class CandidateDao {
    candidate: CandidateDetailsDao;
    profiles: ProfilesDao;
    processes: CandidateProcessDao[];
}
