import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RequestPropsService } from 'src/app/services/requestProps/requestProps.service';
import { WorkflowService } from 'src/app/services/workflow/workflow.service';
import { RequestService } from 'src/app/services/request/request.service';
import {Router} from '@angular/router';


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

  mandatoryCheckboxes = [];
  valuedCheckboxes = [];
  selectedMandatoryCheckboxes = [];
  selectedValuedCheckboxes = [];

  inputDescription: string;
  inputQuantity: number;
  inputSkill: string;
  inputProfile: string;
  inputProject: string;
  inputWorkflow: string;
  inputTargetDate: string;
  inputDateToSendProfile: string;

  skills: string[];
  profiles: string[];
  projects: string[];
  workflows: string[];
  targetDates: string[];

  ngOnInit(): void {

    this.reqPropsService.getRequestSkills()
      .subscribe(skill => { this.skills = skill.skills; },
        error => { console.log(error); });

    this.reqPropsService.getRequestProjects()
      .subscribe(project => { this.projects = project.projects; },
        error => { console.log(error); });

    this.reqPropsService.getRequestProfiles()
      .subscribe(profile => { this.profiles = profile.profiles; },
        error => { console.log(error); });

    this.reqPropsService.getRequestLanguages()
      .subscribe(language => {
        this.mandatoryCheckboxes = this.getLanguagesCheckboxes(language.languages);
        this.valuedCheckboxes = this.getLanguagesCheckboxes(language.languages);
      },
        error => { console.log(error); });

    this.reqPropsService.getTargetDates()
      .subscribe(month => { this.targetDates = month.months; },
        error => { console.log(error); });

    this.workflowService.getAllWorkflows()
      .subscribe(workflow => { this.workflows = workflow.workflows; },
        error => { console.log(error); });
  }

  onSubmit(form: NgForm) {
    this.fetchSelectedItems();
    const value = form.value;
    const body = {
      description: value.inputDescription,
      quantity: value.inputQuantity,
      skill: value.inputSkill,
      profile: value.inputProfile,
      project: value.inputProject,
      mandatoryLanguages: this.selectedMandatoryCheckboxes.map(item => item.label),
      valuedLanguages: this.selectedValuedCheckboxes.map(item => item.label),
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

  private getLanguagesCheckboxes(languages) {
    return languages.map(language => {
      return {
        label: language.language,
        isChecked: false
      };
    });
  }

  private fetchSelectedItems() {
    this.selectedMandatoryCheckboxes = this.mandatoryCheckboxes.filter((value, index) => {
      return value.isChecked;
    });
    this.selectedValuedCheckboxes = this.valuedCheckboxes.filter((value, index) => {
      return value.isChecked;
    });
  }
}


