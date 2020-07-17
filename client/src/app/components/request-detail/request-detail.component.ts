import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RequestService} from 'src/app/services/request/request.service';
import {RequestList} from 'src/app/model/request/request-list';
import {UserRole} from 'src/app/model/user/user-role';
import {ProcessList} from 'src/app/model/process/process-list';
import {RequestDetailProps} from './request-detail-props';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css']
})

export class RequestDetailComponent implements OnInit {

  properties: RequestDetailProps = new RequestDetailProps();

  constructor(
    private router: Router,
    private requestService: RequestService) {
  }

  /**
   * This function fetches all the attributes inherent to a request. Used for the view Request Details.
   * @param requestId is used to get a specific request from the database.
   */
  private getRequest(requestId: number) {
    this.requestService.getRequest(requestId)
      .pipe(
        map(dao => {
            const requests = new RequestList(
              dao.request.id,
              dao.request.workflow,
              dao.request.progress,
              dao.request.state,
              dao.request.description,
              dao.request.quantity,
              dao.request.dateToSendProfile,
              dao.request.project,
              dao.request.requestDate,
              dao.request.skill,
              dao.request.stateCsl,
              dao.request.targetDate,
              dao.request.profile);
            return {dao, requests};
          }
        ),
        map(data => {
          const userRoles = data.dao.userRoles
            .map(userRoleDao => new UserRole(userRoleDao.userId, userRoleDao.email, userRoleDao.roleId, userRoleDao.role));
          return {...data, userRoles};
        }),
        map(data => {
          const processes = data.dao.processes
            .map(processDao => new ProcessList(processDao.status, processDao.candidate.id, processDao.candidate.name));
          return {...data, processes};
        }),
        map(data => {
          const mandatory = data.dao.languages
            .filter(languageDao => languageDao.isMandatory)
            .map(l => l.language).join(', ');
          return {...data, mandatory};
        }),
        map(data => {
          const valued = data.dao.languages
            .filter(languageDao => !languageDao.isMandatory)
            .map(l => l.language).join(', ');
          return {...data, valued};
        }),
      )
      .subscribe(result => {
        this.properties.requestList = result.requests;
        this.properties.requestAttrs = Object.keys(this.properties.requestList).filter(
          attr => attr !== 'phases' && attr !== 'id');
        this.properties.userRoles = result.userRoles;
        this.properties.processes = result.processes;
        this.properties.mandatoryLanguages = result.mandatory;
        this.properties.valuedLanguages = result.valued;
      });

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
