import {ConfigProfile} from 'src/app/model/statistics/config-profile';
import {FormGroup} from '@angular/forms';

export class StatisticsProfilesProps {
  form: FormGroup;
  configProfiles: ConfigProfile[];
  currentProfile: ConfigProfile;
}
