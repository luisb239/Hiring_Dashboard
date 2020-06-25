import {FormGroup} from '@angular/forms';

export class CreateRequestProps {
  form: FormGroup;

  skills: string[];
  profiles: string[];
  projects: string[];
  workflows: string[];
  targetDates: string[];
  languages: string[];
}
