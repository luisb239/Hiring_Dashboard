import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RequestService} from 'src/app/services/request/request.service';
import {RequestList} from 'src/app/model/request/request-list';
import {UserRole} from 'src/app/model/user/user-role';
import {ProcessList} from 'src/app/model/process/process-list';
import {RequestDetailProps} from './request-detail-props';
import {concatMap, defaultIfEmpty, map, switchMap} from 'rxjs/operators';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';
import {AlertService} from '../../services/alert/alert.service';
import {UserService} from '../../services/user/user.service';
import {User} from '../../model/user/user';
import {RequestPropsService} from '../../services/requestProps/requestProps.service';
import {LanguageCheckbox} from '../../model/requestProps/language-checkbox';
import {AuthService} from '../../services/auth/auth.service';
import {ErrorType} from '../../services/common-error';
import {forkJoin, Observable} from 'rxjs';

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
  }

  /**
   * This function will fetch the request's id either through the state passed from the component
   * all-requests or from the url, if the view isn't forwarded by the previous component.
   * Then it calls the function getRequest with the id obtained.
   */

  ngOnInit() {
    this.properties.updateForm = this.formBuilder.group({
      state: '', stateCsl: '', description: '', quantity: '', targetDate: '',
      skill: '', project: '', profile: '', dateToSendProfile: ''
    });
    this.properties.requestId = history.state.requestId || this.router.url.split('/')[2];
    this.getRequestProperties();
    this.getRequestInfo(this.properties.requestId);
    this.properties.userForm = this.formBuilder.group({
      userIdx: this.formBuilder.array([])
    });
  }

  languagesOnChange(event: any, isMandatory: boolean) {
    const language = event.source.value;
    const checked = event.source.checked;
    const languagesToAddOrRemove = isMandatory ? this.properties.valuedLanguages : this.properties.mandatoryLanguages;
    const initialLanguages = isMandatory ? this.properties.initialValuedLanguages : this.properties.initialMandatoryLanguages;
    if (checked) {
      languagesToAddOrRemove.splice(languagesToAddOrRemove.findIndex(l => language === l.language), 1);
    } else {
      if (initialLanguages.find(l => l.language === language)) {
        languagesToAddOrRemove.push(new LanguageCheckbox(language, false, true));
      } else {
        languagesToAddOrRemove.push(new LanguageCheckbox(language, false, false));
      }
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
      .concat(this.properties.initialMandatoryLanguages.filter(l => !this.properties.mandatoryLanguages.includes(l)))
      .map(l => l.language).map(l => this.requestService.deleteLanguageRequirementFromRequest(this.properties.requestId, l, true));

    const mandatoryLanguagesToAdd = this.properties.mandatoryLanguages
      .filter(l => l.checked && !l.initialCheck)
      .map(l => l.language)
      .map(l => this.requestService.addLanguageRequirementToRequest(this.properties.requestId, l, true));

    const valuedLanguagesToRemove = this.properties.valuedLanguages
      .filter(l => !l.checked && l.initialCheck)
      .concat(this.properties.initialValuedLanguages.filter(l => !this.properties.valuedLanguages.includes(l)))
      .map(l => l.language)
      .map(l => this.requestService.deleteLanguageRequirementFromRequest(this.properties.requestId, l, false));

    const valuedLanguagesToAdd = this.properties.valuedLanguages
      .filter(l => l.checked && !l.initialCheck)
      .map(l => l.language)
      .map(l => this.requestService.addLanguageRequirementToRequest(this.properties.requestId, l, false));

    const removeLanguagesObservables = mandatoryLanguagesToRemove.concat(valuedLanguagesToRemove);
    const addLanguagesObservables = mandatoryLanguagesToAdd.concat(valuedLanguagesToAdd);

    if (this.patchObj && Object.keys(this.patchObj).length) {
      this.patchObj.timestamp = this.properties.requestList.timestamp;
      this.requestService.updateRequest(this.properties.requestId, this.patchObj)
        .pipe(concatMap(() => this.addAndRemoveLanguages(removeLanguagesObservables, addLanguagesObservables)))
        .subscribe(() => {
          this.patchObj = {};
          this.initialValues = this.properties.updateForm.value;
          this.properties.updateForm.reset(this.initialValues);
          this.alertService.success('Request updated successfully!');
          this.getRequestInfo(this.properties.requestId);
        }, error => {
          this.patchObj = {};
          if (error === ErrorType.CONFLICT) {
            this.alertService.error('Request info has already been updated');
            this.alertService.info('Refreshing request details...');
            this.getRequestInfo(this.properties.requestId);
          }
        });
    } else if (removeLanguagesObservables.length > 0 || addLanguagesObservables.length > 0) {
      this.addAndRemoveLanguages(removeLanguagesObservables, addLanguagesObservables).subscribe(() => {
        this.alertService.success('Request languages updated successfully!');
        this.getRequestInfo(this.properties.requestId);
      }, error => {
        if (error === ErrorType.CONFLICT || error === ErrorType.GONE) {
          this.alertService.error(`This request's languages have already been updated`);
          this.alertService.info('Refreshing request details...');
          this.getRequestInfo(this.properties.requestId);
        }
      });
    }
  }

  addAndRemoveLanguages(languagesToRemove: Observable<any>[], languagesToAdd: Observable<any>[]): Observable<any> {
    return forkJoin(languagesToRemove)
      .pipe(
        defaultIfEmpty(null),
        concatMap(() => forkJoin(languagesToAdd)
          .pipe(defaultIfEmpty(null))));
  }

  getRequestProperties() {
    // Get states from server
    this.reqPropsService.getRequestStates()
      .pipe(map(dao => dao.states
        .map(s => s.state)))
      .subscribe(s => this.properties.states = s);
    // Get states csl from server
    this.reqPropsService.getRequestStatesCsl()
      .pipe(map(dao => dao.statesCsl
        .map(s => s.stateCsl)))
      .subscribe(s => this.properties.statesCsl = s);
    // Get all projects from server
    this.reqPropsService.getRequestProjects()
      .pipe(map(dao => dao.projects
        .map(p => p.project)))
      .subscribe(p => this.properties.projects = p);
    // Get all skills from server
    this.reqPropsService.getRequestSkills()
      .pipe(map(dao => dao.skills
        .map(s => s.skill)))
      .subscribe(s => this.properties.skills = s);
    // Get all profiles from server
    this.reqPropsService.getRequestProfiles()
      .pipe(map(dao => dao.profiles
        .map(p => p.profile)))
      .subscribe(p => this.properties.profiles = p);
    // Get all target dates(months) from server
    this.reqPropsService.getTargetDates()
      .pipe(map(dao => dao.months
        .map(m => m.month)))
      .subscribe(t => this.properties.targetDates = t);
  }

  onSubmit() {
    const values = this.properties.userForm.value.userIdx;
    this.userService.getRoleIdByName('recruiter')
      .pipe(concatMap(role =>
        forkJoin(this.getObservables(values, role.id))
          .pipe(defaultIfEmpty(null))))
      .subscribe(() => {
        this.alertService.success('Recruiters added to this request successfully!');
        this.getRequestInfo(this.properties.requestId);
      }, error => {
        if (error === ErrorType.CONFLICT) {
          this.alertService.error('The user you were trying to add to the request has already been added.');
          this.alertService.info('Refreshing request details...');
          this.getRequestInfo(this.properties.requestId);
        }
      });
  }

  getObservables(values, roleId: number) {
    const observables = [];
    values.forEach(idx =>
      observables.push(this.requestService.addUser(this.properties.requestId, this.properties.users[idx].userId, roleId)));
    return observables;
  }

  // Maybe this methods are unnecessary...
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

  usersOnChange(idx: number, event: any) {
    const array = this.properties.userForm.controls.userIdx as FormArray;
    if (event.target.checked) {
      array.push(new FormControl(idx));
    } else {
      const index = array.controls.findIndex(x => x.value === idx);
      array.removeAt(index);
    }
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
            dao.request.profile,
            [],
            dao.request.timestamp);
          return {dao, requests};
        }),
        map(data => {
          const userRoles = data.dao.userRoles
            .map(userRoleDao => new UserRole(userRoleDao.userId, userRoleDao.email, userRoleDao.roleId, userRoleDao.role));
          const processes = data.dao.processes
            .map(processDao =>
              new ProcessList(processDao.status, processDao.candidate.id, processDao.candidate.name, processDao.timestamp));
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
        this.properties.requestAttrs = Object
          .keys(this.properties.requestList)
          .filter(attr => attr !== 'phases' && attr !== 'id');
        this.properties.userRoles = result.userRoles;
        this.properties.processes = result.processes;
        this.properties.initialMandatoryLanguages = result.mandatory;
        this.properties.initialValuedLanguages = result.valued;
        // Get all recruiters
        this.userService.getRoleIdByName('recruiter')
          .pipe(
            switchMap(dao => this.userService.getAllUsers(dao.id)),
            map(dao => {
              const existingUsers = this.properties.userRoles.map(u => u.userId);
              return dao.users
                .filter(user => !existingUsers.includes(user.id))
                .map(user => new User(user.id, user.email));
            })
          )
          .subscribe(users => {
            this.properties.users = users;
          });

        // Get all languages from server
        this.reqPropsService.getRequestLanguages()
          .pipe(map(dao => dao.languages
            .map(l => l.language)))
          .subscribe(lang => {
            this.properties.languages = lang;
            const mandatory = this.properties.initialMandatoryLanguages.map(l => l.language);
            const valued = this.properties.initialValuedLanguages.map(l => l.language);
            this.properties.mandatoryLanguages = this.properties.initialMandatoryLanguages.concat(lang
              .filter(l => !mandatory.includes(l) && !valued.includes(l))
              .map(l => new LanguageCheckbox(l, false, false)));
            this.properties.valuedLanguages = this.properties.initialValuedLanguages.concat(lang
              .filter(l => !valued.includes(l) && !mandatory.includes(l))
              .map(l => new LanguageCheckbox(l, false, false)));
          });

        // Set form values to the values retrieved by the server
        this.properties.updateForm.setValue({
          state: result.requests.state,
          stateCsl: result.requests.stateCSL,
          description: result.requests.description,
          quantity: result.requests.quantity,
          targetDate: result.requests.targetDate,
          skill: result.requests.skill,
          project: result.requests.project,
          profile: result.requests.profile,
          dateToSendProfile: result.requests.dateToSendProfile
        });
      });
  }
}
