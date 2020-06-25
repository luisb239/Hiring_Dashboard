import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from 'src/app/services/request/request.service';
import { RequestList } from 'src/app/model/request/request-list';
import { UserRole } from 'src/app/model/user/user-role';
import { LanguageList } from 'src/app/model/requestProps/language-list';
import { ProcessList } from 'src/app/model/process/process-list';
import { RequestDetailProps } from './request-detail-props';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css']
})

export class RequestDetailComponent implements OnInit {

  properties: RequestDetailProps = new RequestDetailProps();

  constructor(
    private router: Router,
    private requestService: RequestService) { }

  /**
   * This function fetches all the attributes inherent to a request. Used for the view Request Details.
   * @param requestId is used to get a specific request from the database.
   */
  private getRequest(requestId: number) {
    this.requestService.getRequest(requestId).subscribe(
      reqDao => {
        this.properties.requestList = new RequestList(
          reqDao.request.id,
          reqDao.request.workflow,
          reqDao.request.progress,
          reqDao.request.state,
          reqDao.request.description,
          reqDao.request.quantity,
          reqDao.request.dateToSendProfile,
          reqDao.request.project,
          reqDao.request.requestDate,
          reqDao.request.skill,
          reqDao.request.stateCsl,
          reqDao.request.targetDate,
          reqDao.request.profile);
        this.properties.userRoles = reqDao.userRoles.map(
          userRoleDao => new UserRole(
            userRoleDao.userId, userRoleDao.email, userRoleDao.roleId, userRoleDao.role));
        this.properties.processes = reqDao.processes.map(
          processDao => new ProcessList(
            processDao.status, processDao.candidate.id, processDao.candidate.name));
        this.properties.mandatoryLanguages = reqDao.languages
          .filter(languageDao => languageDao.isMandatory)
          .map(languageDao => languageDao.language)
          .join(', ');
        this.properties.valuedLanguages = reqDao.languages
          .filter(languageDao => !languageDao.isMandatory)
          .map(languagesDao => languagesDao.language)
          .join(', ');
        this.properties.requestAttrs = Object.keys(this.properties.requestList).filter(
          attr => attr !== 'phases' && attr !== 'id');
      }, error => {
        console.log(error);
      }
    );
  }
  /**
   * This function will fetch the request's id either through the state passed from the component
   * all-requests or from the url, if the view isn't forwarded by the previous component.
   * Then it calls the function getRequest with the id obtained.
   */
  ngOnInit() {
    this.properties.requestId = history.state.requestId || this.router.url.split('/')[2];
    this.getRequest(this.properties.requestId);
  }

}
