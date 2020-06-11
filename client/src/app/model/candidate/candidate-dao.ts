import { CandidateInformationDao } from './candidate-information-dao';
import {ProfileDao} from '../profile/profile-dao';
import {CandidateProcessDao} from './candidate-process-dao';

export class CandidateDao {
    candidate: CandidateInformationDao;
    profiles: ProfileDao[];
    processes: CandidateProcessDao[];
}
