import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RequestPropsService } from 'src/app/services/requestProps/requestProps.service';
import { WorkflowService } from 'src/app/services/workflow/workflow.service';
import { RequestService } from 'src/app/services/request/request.service';


@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  constructor(private reqPropsService: RequestPropsService,
              private workflowService: WorkflowService,
              private requestService: RequestService) { }

  inputDescription: string;
  inputQuantity: string;
  inputSkill: string;
  inputProfile: string;
  inputMandatoryLanguage: string;
  inputValuedLanguage: string;
  inputWorkflow: string;
  inputTargetDate: string;
  inputDateToSendProfile: string;

  skills: string[];
  profiles: string[];
  projects: string[];
  mandatoryLanguages: string[];
  valuedLanguages: string[];
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
        this.mandatoryLanguages = language.languages;
        this.valuedLanguages = language.languages;
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
    alert('Description is ' + form.value.inputDescription);
    // this.requestService.createRequest()
  }

}
