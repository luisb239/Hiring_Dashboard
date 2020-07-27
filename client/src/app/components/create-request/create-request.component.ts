import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';
import {RequestPropsService} from 'src/app/services/requestProps/requestProps.service';
import {WorkflowService} from 'src/app/services/workflow/workflow.service';
import {RequestService} from 'src/app/services/request/request.service';
import {Router} from '@angular/router';
import {CreateRequestProps} from './create-request-props';
import {AlertService} from '../../services/alert/alert.service';


@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  constructor(
    private router: Router,
    private reqPropsService: RequestPropsService,
    private workflowService: WorkflowService,
    private requestService: RequestService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
  }

  properties: CreateRequestProps = new CreateRequestProps();

  /**
   * This function will fetch all the properties available in the system to create a request.
   * These properties will be presented to the user in the create request view.
   */
  ngOnInit(): void {

    this.reqPropsService.getRequestSkills()
      .subscribe(dao => {
          this.properties.skills = dao.skills.map(s => s.skill);
        },
        error => {
          console.log(error);
        });

    this.reqPropsService.getRequestProjects()
      .subscribe(dao => {
          this.properties.projects = dao.projects.map(p => p.project);
        },
        error => {
          console.log(error);
        });

    this.reqPropsService.getRequestProfiles()
      .subscribe(dao => {
          this.properties.profiles = dao.profiles.map(p => p.profile);
        },
        error => {
          console.log(error);
        });

    this.reqPropsService.getRequestLanguages()
      .subscribe(dao => {
          this.properties.languages = dao.languages.map(l => l.language);
        },
        error => {
          console.log(error);
        });

    this.reqPropsService.getTargetDates()
      .subscribe(dao => {
          this.properties.targetDates = dao.months.map(m => m.month);
        },
        error => {
          console.log(error);
        });

    this.workflowService.getAllWorkflows()
      .subscribe(dao => {
          this.properties.workflows = dao.workflows.map(w => w.workflow);
        },
        error => {
          console.log(error);
        });
    this.properties.form = this.formBuilder.group({
      description: this.formBuilder.control(''),
      quantity: this.formBuilder.control(1),
      skill: this.formBuilder.control(''),
      profile: this.formBuilder.control(''),
      project: this.formBuilder.control(''),
      mandatoryLanguages: this.formBuilder.array([]),
      valuedLanguages: this.formBuilder.array([]),
      workflow: this.formBuilder.control(''),
      targetDate: this.formBuilder.control(''),
      dateToSendProfile: this.formBuilder.control('')
    });
  }

  /**
   * This function starts by fetching all the selected checkboxes. Then it sends a request to the
   * server, to create a new request, with all the values obtained from the user.
   */
  onSubmit() {
    const value = this.properties.form.value;
    const body = {
      description: value.description,
      quantity: value.quantity,
      skill: value.skill,
      profile: value.profile,
      project: value.project,
      mandatoryLanguages: value.mandatoryLanguages.map(idx => this.properties.languages[idx]),
      valuedLanguages: value.valuedLanguages.map(idx => this.properties.languages[idx]),
      workflow: value.workflow,
      targetDate: value.targetDate,
      dateToSendProfile: value.dateToSendProfile
    };
    this.requestService.createRequest(body)
      .subscribe(success => {
          this.alertService.success('Request Created Successfully!');
          this.router.navigate(['/all-requests']);
        },
        error => {
          console.log(error);
        });
  }

  onChange(isMandatory: boolean, idx: number, event: any) {
    const array = isMandatory ? this.properties.form.controls.mandatoryLanguages as FormArray :
      this.properties.form.controls.valuedLanguages as FormArray;
    if (event.target.checked) {
      array.push(new FormControl(idx));
    } else {
      const index = array.controls.findIndex(x => x.value === idx);
      array.removeAt(index);
    }
  }
}


