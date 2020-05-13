import { Component, OnInit } from '@angular/core'
import { RequestPropsService } from 'src/app/services/requestProps/requestProps.service'
import { WorkflowService } from 'src/app/services/workflow/workflow.service'

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  constructor(private reqPropsService: RequestPropsService, private workflowService: WorkflowService) { }

  skills: string[]
  profiles: string[]
  projects: string[]
  mandatoryLanguages: string[]
  valuedLanguages: string[]
  workflows: string[]
  targetDates: string[]

  ngOnInit(): void {

    this.reqPropsService.getRequestSkills()
      .subscribe(skill => { this.skills = skill.skills },
        error => { console.log(error) })

    this.reqPropsService.getRequestProjects()
      .subscribe(project => { this.projects = project.projects },
        error => { console.log(error) })

    this.reqPropsService.getRequestProfiles()
      .subscribe(profile => { this.profiles = profile.profiles },
        error => { console.log(error) })

    this.reqPropsService.getRequestLanguages()
      .subscribe(language => {
        this.mandatoryLanguages = language.languages
        this.valuedLanguages = language.languages
      },
        error => { console.log(error) })

    this.reqPropsService.getTargetDates()
      .subscribe(month => { this.targetDates = month.months },
        error => { console.log(error) })

    this.workflowService.getAllWorkflows()
      .subscribe(workflow => { this.workflows = workflow.workflows },
        error => { console.log(error) })
  }

}
