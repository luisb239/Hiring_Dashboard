import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RequestPropsService } from 'src/app/services/requestProps/requestProps.service';
import { WorkflowService } from 'src/app/services/workflow/workflow.service';
import { RequestService } from 'src/app/services/request/request.service';
import { Router } from '@angular/router';
import { CreateRequestProps } from './create-request-props';


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
    private requestService: RequestService) { }

  properties: CreateRequestProps = new CreateRequestProps();

  /**
   * This function will fetch all the properties available in the system to create a request.
   * These properties will be presented to the user in the create request view.
   */
  ngOnInit(): void {

    this.reqPropsService.getRequestSkills()
      .subscribe(dao => { this.properties.skills = dao.skills.map(s => s.skill); },
        error => { console.log(error); });

    this.reqPropsService.getRequestProjects()
      .subscribe(dao => { this.properties.projects = dao.projects.map(p => p.project); },
        error => { console.log(error); });

    this.reqPropsService.getRequestProfiles()
      .subscribe(dao => { this.properties.profiles = dao.profiles.map(p => p.profile); },
        error => { console.log(error); });

    this.reqPropsService.getRequestLanguages()
      .subscribe(dao => {
        this.properties.mandatoryCheckboxes = this.getLanguagesCheckboxes(dao.languages);
        this.properties.valuedCheckboxes = this.getLanguagesCheckboxes(dao.languages);
      },
        error => { console.log(error); });

    this.reqPropsService.getTargetDates()
      .subscribe(dao => { this.properties.targetDates = dao.months.map(m => m.month); },
        error => { console.log(error); });

    this.workflowService.getAllWorkflows()
      .subscribe(dao => { this.properties.workflows = dao.workflows.map(w => w.workflow); },
        error => { console.log(error); });
  }

  /**
   * This function starts by fetching all the selected checkboxes. Then it sends a request to the
   * server, to create a new request, with all the values obtained from the user.
   * @param form is used to obtain all the input values from the user.
   */
  onSubmit(form: NgForm) {
    this.fetchSelectedItems();
    const value = form.value;
    const body = {
      description: value.inputDescription,
      quantity: value.inputQuantity,
      skill: value.inputSkill,
      profile: value.inputProfile,
      project: value.inputProject,
      mandatoryLanguages: this.properties.selectedMandatoryCheckboxes.map(item => item.label),
      valuedLanguages: this.properties.selectedValuedCheckboxes.map(item => item.label),
      workflow: value.inputWorkflow,
      targetDate: value.inputTargetDate,
      dateToSendProfile: value.inputDateToSendProfile
    };
    this.requestService.createRequest(body)
      .subscribe(success => {
        alert('Request with id ' + success.id + ' created');
        this.router.navigate(['/all-requests']);
      },
        error => { console.log(error); });
  }

  /**
   * This function maps request's languages into objects useful for later implementing checkboxes.
   * @param languages used to map the request's languages into checkboxes.
   */
  private getLanguagesCheckboxes(languages) {
    return languages.map(dao => {
      return {
        label: dao.language,
        isChecked: false
      };
    });
  }

  /**
   * This function filters all the checkboxes selected by the user.
   */
  private fetchSelectedItems() {
    this.properties.selectedMandatoryCheckboxes = this.properties.mandatoryCheckboxes.filter(
      (value, index) => {
        return value.isChecked;
      });
    this.properties.selectedValuedCheckboxes = this.properties.valuedCheckboxes.filter(
      (value, index) => {
        return value.isChecked;
      });
  }
}


