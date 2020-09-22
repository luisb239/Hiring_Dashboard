import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { RequestPropsService } from 'src/app/services/requestProps/requestProps.service';
import { WorkflowService } from 'src/app/services/workflow/workflow.service';
import { RequestService } from 'src/app/services/request/request.service';
import { Router } from '@angular/router';
import { CreateRequestProps } from './create-request-props';
import { AlertService } from '../../services/alert/alert.service';
import { concatMap, defaultIfEmpty, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

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

  mandatoryLanguagesForm = new FormControl();
  valuedLanguagesForm = new FormControl();
  mandatorySelectedLanguages = [];
  valuedSelectedLanguages = [];

  properties: CreateRequestProps = new CreateRequestProps();

  /**
   * This function will fetch all the properties available in the system to create a request.
   * These properties will be presented to the user in the create request view.
   */
  ngOnInit(): void {
    this.reqPropsService.getRequestSkills()
      .subscribe(dao => this.properties.skills = dao.skills.map(s => s.skill));

    this.reqPropsService.getRequestProjects()
      .subscribe(dao => this.properties.projects = dao.projects.map(p => p.project));

    this.reqPropsService.getRequestProfiles()
      .subscribe(dao => this.properties.profiles = dao.profiles.map(p => p.profile));

    this.reqPropsService.getRequestLanguages()
      .subscribe(dao => this.properties.languages = dao.languages.map(l => l.language));

    this.reqPropsService.getTargetDates()
      .subscribe(dao => this.properties.targetDates = dao.months.map(m => m.month));

    this.workflowService.getAllWorkflows()
      .subscribe(dao => this.properties.workflows = dao.workflows.map(w => w.workflow));

    // Initialize form group
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
    if (value.description === '' || value.skill === '' ||
      value.profile === '' || value.project === '' || value.workflow === '' ||
      value.targetDate === '') {
      this.alertService.warn('Please fulfill all the mandatory forms.');
    } else {
      const body = {
        description: value.description,
        quantity: value.quantity,
        skill: value.skill,
        profile: value.profile,
        project: value.project,
        workflow: value.workflow,
        targetDate: value.targetDate,
        dateToSendProfile: value.dateToSendProfile
      };

      this.requestService.createRequest(body)
        .pipe(concatMap(dao =>
          forkJoin(this.getLanguagesObservableArray(dao.id))
            .pipe(defaultIfEmpty(null))
            .pipe(map(() => dao))))
        .subscribe(res => {
          this.alertService.success('Request Created Successfully!');
          this.router.navigate(['/request-detail', res.id]);
        });
    }
  }

  getLanguagesObservableArray(requestId: number) {
    const observables = [];
    this.mandatorySelectedLanguages.forEach(mL =>
      observables.push(this.requestService.addLanguageRequirementToRequest(requestId, mL, true)));
    this.valuedSelectedLanguages.forEach(vL =>
      observables.push(this.requestService.addLanguageRequirementToRequest(requestId, vL, false)));
    return observables;
  }

  change(event, mandatoryLanguage: boolean) {
    if (event.isUserInput) {
      if (mandatoryLanguage) {
        if (event.source.selected) {
          this.mandatorySelectedLanguages.push(event.source.value);
        } else {
          this.mandatorySelectedLanguages.splice(this.mandatorySelectedLanguages.indexOf(event.source.value), 1);
        }
      } else {
        if (event.source.selected) {
          this.valuedSelectedLanguages.push(event.source.value);
        } else {
          this.valuedSelectedLanguages.splice(this.valuedSelectedLanguages.indexOf(event.source.value), 1);
        }
      }
    }
  }

  mandatoryAvailableLanguages() {
    return this.properties.languages ? this.properties.languages.filter(l => !this.valuedSelectedLanguages.includes(l)) : [];
  }

  valuedAvailableLanguages() {
    return this.properties.languages ? this.properties.languages.filter(l => !this.mandatorySelectedLanguages.includes(l)) : [];
  }

}


