import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RequestService} from 'src/app/services/request/request.service';
import {RequestList} from 'src/app/model/request/request-list';
import {UserRole} from 'src/app/model/user/user-role';
import {ProcessList} from 'src/app/model/process/process-list';
import {RequestDetailProps} from './request-detail-props';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';
import {AlertService} from '../../services/alert/alert.service';
import {UserService} from '../../services/user/user.service';
import {User} from '../../model/user/user';
import {RequestPropsService} from '../../services/requestProps/requestProps.service';
import {LanguageCheckbox} from '../../model/requestProps/language-checkbox';
import {AuthService} from '../../services/auth/auth.service';
import {ErrorType} from '../../services/common-error';
import * as moment from 'moment';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css']
})

export class RequestDetailComponent implements OnInit {

  properties: RequestDetailProps = new RequestDetailProps();
  patchObj: any = {};
  initialValues: any;

  constructor(
    private router: Router,
    private requestService: RequestService,
    private formBuilder: FormBuilder,
    private reqPropsService: RequestPropsService,
    private userService: UserService,
    private alertService: AlertService,
    public authService: AuthService) {
    this.properties.updateForm = this.formBuilder.group({});
  }

  /**
   * This function will fetch the request's id either through the state passed from the component
   * all-requests or from the url, if the view isn't forwarded by the previous component.
   * Then it calls the function getRequest with the id obtained.
   */
  ngOnInit() {
    this.properties.requestId = history.state.requestId || this.router.url.split('/')[2];
    this.getRequestProperties();
    this.getRequestInfo(this.properties.requestId);
    this.properties.userForm = this.formBuilder.group({
      userIdx: this.formBuilder.array([])
    });
  }

  onChange(idx: number, event: any) {
    const array = this.properties.userForm.controls.userIdx as FormArray;

    if (event.target.checked) {
      array.push(new FormControl(idx));
    } else {
      const index = array.controls.findIndex(x => x.value === idx);
      array.removeAt(index);
    }
  }

  onUpdate() {
    Object.keys(this.properties.updateForm.controls).forEach((key) => {
      const form = this.properties.updateForm.get(key);
      if (form.dirty) {
        this.patchObj[key] = form.value;
      }
    });

    const mandatoryLanguagesToRemove = this.properties.mandatoryLanguages
      .filter(l => !l.checked && l.initialCheck)
      .map(l => l.language)
      .map(l => this.requestService.deleteLanguageRequirementFromRequest(this.properties.requestId, l, true));

    const mandatoryLanguagesToAdd = this.properties.mandatoryLanguages
      .filter(l => l.checked && !l.initialCheck)
      .map(l => l.language)
      .map(l => this.requestService.addLanguageRequirementToRequest(this.properties.requestId, l, true));

    const valuedLanguagesToRemove = this.properties.valuedLanguages
      .filter(l => !l.checked && l.initialCheck)
      .map(l => l.language)
      .map(l => this.requestService.deleteLanguageRequirementFromRequest(this.properties.requestId, l, false));

    const valuedLanguagesToAdd = this.properties.valuedLanguages
      .filter(l => l.checked && !l.initialCheck)
      .map(l => l.language)
      .map(l => this.requestService.addLanguageRequirementToRequest(this.properties.requestId, l, false));

    let observables = [];
    observables = observables
      .concat(mandatoryLanguagesToRemove)
      .concat(mandatoryLanguagesToAdd)
      .concat(valuedLanguagesToRemove)
      .concat(valuedLanguagesToAdd);

    console.log('observables', observables);
    // No attributes to update
    if (this.patchObj && Object.keys(this.patchObj).length) {
      this.patchObj.timestamp = this.properties.timestamp;
      this.requestService.updateRequest(this.properties.requestId, this.patchObj)
        .subscribe(() => {
          this.patchObj = {};
          this.initialValues = this.properties.updateForm.value;
          this.properties.updateForm.reset(this.initialValues);
          this.alertService.success('Updated request details successfully!');
          this.getRequestInfo(this.properties.requestId);
        });
    }

    /*
    if (mandatoryLanguages && mandatoryLanguages.length) {
      this.patchObj.mandatoryLanguages = mandatoryLanguages;
    }

    if (valuedLanguages && valuedLanguages.length) {
      this.patchObj.valuedLanguages = valuedLanguages;
    }
    */
  }

  getRequestProperties() {
    // Get states from server
    this.reqPropsService.getRequestStates()
      .pipe(map(dao => dao.states
        .map(s => s.state)))
      .subscribe(s => this.properties.states = s,
        () => {
          this.alertService.error('Unexpected server error. Refresh and try again.');
        });
    // Get states csl from server
    this.reqPropsService.getRequestStatesCsl()
      .pipe(map(dao => dao.statesCsl
        .map(s => s.stateCsl)))
      .subscribe(s => this.properties.statesCsl = s,
        () => {
          this.alertService.error('Unexpected server error. Refresh and try again.');
        });
    // Get all projects from server
    this.reqPropsService.getRequestProjects()
      .pipe(map(dao => dao.projects
        .map(p => p.project)))
      .subscribe(p => this.properties.projects = p,
        () => this.alertService.error('Unexpected server error. Refresh and try again.'));
    // Get all skills from server
    this.reqPropsService.getRequestSkills()
      .pipe(map(dao => dao.skills
        .map(s => s.skill)))
      .subscribe(s => this.properties.skills = s,
        () => this.alertService.error('Unexpected server error. Refresh and try again.'));
    // Get all profiles from server
    this.reqPropsService.getRequestProfiles()
      .pipe(map(dao => dao.profiles
        .map(p => p.profile)))
      .subscribe(p => this.properties.profiles = p,
        () => this.alertService.error('Unexpected server error. Refresh and try again.'));
    // Get all target dates(months) from server
    this.reqPropsService.getTargetDates()
      .pipe(map(dao => dao.months
        .map(m => m.month)))
      .subscribe(t => this.properties.targetDates = t,
        () => this.alertService.error('Unexpected server error. Refresh and try again.'));
    // Get all recruiters
    // Try to pipe this ??
    // TODO -> THIS IS WRONG, ALL USERS, AND THIS REQUEST USERS IS NOT RIGHT. FIX THIS
    this.userService.getRoleIdByName('recruiter')
      .pipe(
        switchMap(dao => this.userService.getAllUsers(dao.id)),
        map(dao => {
          return dao.users.map(user => new User(user.id, user.email));
        }))
      .subscribe(recruiters => this.properties.users = recruiters);
  }

  onSubmit() {
    const values = this.properties.userForm.value.userIdx;
    this.userService.getRoleIdByName('recruiter')
      .subscribe(dao => {
          const roleId = dao.id;
          values.forEach(idx => {
            this.requestService.addUser(this.properties.requestId, this.properties.users[idx].userId, roleId, this.properties.timestamp)
              .subscribe(() => {
                  this.alertService.success('Recruiters added to this request successfully!');
                  this.getRequestInfo(this.properties.requestId);
                }, error => {
                  if (error === ErrorType.CONFLICT) {
                    this.alertService.error('The user you were trying to add to the request has already been added by another user.');
                    this.alertService.info('Refreshing request details...');
                    this.getRequestInfo(this.properties.requestId);
                  }
                }
              );
          });
        }
      );
  }

  getAvailableStates() {
    return this.properties.states ? this.properties.states.filter(s => s !== this.properties.requestList.state) : [];
  }

  getAvailableStatesCsl() {
    return this.properties.statesCsl ? this.properties.statesCsl.filter(s => s !== this.properties.requestList.stateCSL) : [];
  }

  getAvailableProjects() {
    return this.properties.projects ? this.properties.projects.filter(s => s !== this.properties.requestList.project) : [];
  }

  getAvailableSkills() {
    return this.properties.skills ? this.properties.skills.filter(s => s !== this.properties.requestList.skill) : [];
  }

  getAvailableTargetDates() {
    return this.properties.targetDates ? this.properties.targetDates.filter(s => s !== this.properties.requestList.targetDate) : [];
  }

  getAvailableProfiles() {
    return this.properties.profiles ? this.properties.profiles.filter(s => s !== this.properties.requestList.profile) : [];
  }

  /**
   * This function fetches all the attributes inherent to a request. Used for the view Request Details.
   * @param requestId is used to get a specific request from the database.
   */
  private getRequestInfo(requestId: number) {
    this.requestService.getRequest(requestId)
      .pipe(map(dao => {
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
        }),
        map(data => {
          const userRoles = data.dao.userRoles
            .map(userRoleDao => new UserRole(userRoleDao.userId, userRoleDao.email, userRoleDao.roleId, userRoleDao.role));
          const processes = data.dao.processes
            .map(processDao => new ProcessList(processDao.status, processDao.candidate.id, processDao.candidate.name));
          const mandatory = data.dao.languages
            .filter(languageDao => languageDao.isMandatory)
            .map(l => new LanguageCheckbox(l.language, true, true));
          const valued = data.dao.languages
            .filter(languageDao => !languageDao.isMandatory)
            .map(l => new LanguageCheckbox(l.language, true, true));
          return {...data, userRoles, processes, mandatory, valued};
        }))
      .subscribe(result => {
        this.properties.requestList = result.requests;
        this.properties.requestAttrs = Object.keys(this.properties.requestList)
          .filter(attr => attr !== 'phases' && attr !== 'id');
        this.properties.userRoles = result.userRoles;
        this.properties.processes = result.processes;
        this.properties.mandatoryLanguages = result.mandatory;
        this.properties.valuedLanguages = result.valued;
        this.properties.timestamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');

        // Get all languages from server
        this.reqPropsService.getRequestLanguages()
          .pipe(map(dao => dao.languages
            .map(l => l.language)))
          .subscribe(lang => {
              this.properties.languages = lang;
              const mandatory = this.properties.mandatoryLanguages.map(l => l.language);
              const valued = this.properties.valuedLanguages.map(l => l.language);
              this.properties.mandatoryLanguages = this.properties.mandatoryLanguages.concat(lang
                .filter(l => !mandatory.includes(l))
                .map(l => new LanguageCheckbox(l, false, false))
              );
              this.properties.valuedLanguages = this.properties.valuedLanguages.concat(lang
                .filter(l => !valued.includes(l))
                .map(l => new LanguageCheckbox(l, false, false))
              );
            },
            () => this.alertService.error('Unexpected server error. Refresh and try again.'));

        // TODO -> DONT ADD control..init in ngOnInit and here we only set value
        // TODO -> also add description to update form
        this.properties.updateForm.addControl('state', new FormControl(result.requests.state));
        this.properties.updateForm.addControl('stateCsl', new FormControl(result.requests.stateCSL));
        this.properties.updateForm.addControl('description', new FormControl(result.requests.description));
        this.properties.updateForm.addControl('quantity', new FormControl(result.requests.quantity));
        this.properties.updateForm.addControl('targetDate', new FormControl(result.requests.targetDate));
        this.properties.updateForm.addControl('skill', new FormControl(result.requests.skill));
        this.properties.updateForm.addControl('project', new FormControl(result.requests.project));
        this.properties.updateForm.addControl('profile', new FormControl(result.requests.profile));
        this.properties.updateForm.addControl('dateToSendProfile', new FormControl(result.requests.dateToSendProfile));
      });
  }
}
