import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/services/request/request.service';
import { RequestList } from 'src/app/model/request-list';
import { UserRole } from 'src/app/model/user-role';
import { Candidate } from 'src/app/model/candidate';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css']
})
export class RequestDetailComponent implements OnInit {
  requestId: number;
  requestList: RequestList;
  userRoles: UserRole[];
  candidates: Candidate[];

  constructor(
    private router: Router,
    private requestService: RequestService) { }

  private getRequest(requestId: number) {
    this.requestService.getRequest(requestId).subscribe(
      reqDao => {
        this.requestList = new RequestList(
          reqDao.request.id,
          reqDao.request.workflow,
          reqDao.request.progress,
          reqDao.request.state,
          reqDao.request.description,
          [],
          reqDao.request.dateToSendProfile,
          reqDao.request.project,
          reqDao.request.quantity,
          reqDao.request.requestDate,
          reqDao.request.skill,
          reqDao.request.stateCsl,
          reqDao.request.targetDate,
          reqDao.request.profile);
        this.userRoles = reqDao.userRoles.map(
          userRoleDao => new UserRole(userRoleDao.id, userRoleDao.username, userRoleDao.role));
        this.candidates = reqDao.candidates.map(
          candidateDao => new Candidate(
            candidateDao.candidate.name, candidateDao.candidate.id, candidateDao.candidate.profileInfo, candidateDao.candidate.available));
      }, error => {
      }
    );
  }
  ngOnInit() {
    this.requestId = history.state.requestId || this.router.url.split('/')[2];
    this.getRequest(this.requestId);
  }

}
