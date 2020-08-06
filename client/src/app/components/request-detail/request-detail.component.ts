import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RequestService} from 'src/app/services/request/request.service';
import {RequestList} from 'src/app/model/request/request-list';
import {UserRole} from 'src/app/model/user/user-role';
import {ProcessList} from 'src/app/model/process/process-list';
import {RequestDetailProps} from './request-detail-props';
import {map, switchMap} from 'rxjs/operators';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';
import {AlertService} from '../../services/alert/alert.service';
import {UserService} from '../../services/user/user.service';
import {User} from '../../model/user/user';
import {RequestPropsService} from '../../services/requestProps/requestProps.service';
import {LanguageCheckbox} from '../../model/requestProps/language-checkbox';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css']
})

export class RequestDetailComponent implements OnInit {

  properties: RequestDetailProps = new RequestDetailProps();

  constructor(
    private router: Router,
    private requestService: RequestService,
    private formBuilder: FormBuilder,
    private reqPropsService: RequestPropsService,
    private userService: UserService,
    private alertService: AlertService) {
    this.properties.updateForm = this.formBuilder.group({});
  }

  /**
   * This function fetches all the attributes inherent to a request. Used for the view Request Details.
   * @param requestId is used to get a specific request from the database.
   */
  private getRequestAndUsers(requestId: number) {
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
            .map(l => new LanguageCheckbox(l.language, true, true));
          return {...data, mandatory};
        }),
        map(data => {
          const valued = data.dao.languages
            .filter(languageDao => !languageDao.isMandatory)
            .map(l => new LanguageCheckbox(l.language, true, true));
          return {...data, valued};
        }),
      )
      .subscribe(result => {
        this.properties.requestList = result.requests;
        this.properties.requestAttrs = Object.keys(this.properties.requestList)
          .filter(attr => attr !== 'phases' && attr !== 'id');
        this.properties.userRoles = result.userRoles;
        this.properties.processes = result.processes;
        this.properties.mandatoryLanguages = result.mandatory;
        this.properties.valuedLanguages = result.valued;


        this.properties.updateForm.addControl('project', new FormControl(result.requests.project));
        this.properties.updateForm.addControl('skill', new FormControl(result.requests.skill));
        this.properties.updateForm.addControl('stateCsl', new FormControl(result.requests.stateCSL));
        this.properties.updateForm.addControl('targetDate', new FormControl(result.requests.targetDate));
        this.properties.updateForm.addControl('profile', new FormControl(result.requests.profile));
        this.properties.updateForm.addControl('dateToSendProfile', new FormControl(result.requests.dateToSendProfile));
        this.properties.updateForm.addControl('quantity', new FormControl(result.requests.quantity));

        this.userService.getRoleIdByName('recruiter')
          .pipe(
            switchMap(dao => {
              console.log(dao);
              return this.userService.getAllUsers(dao.id);
            }),
            map(dao => {
              console.log('hello', dao);
              const existingUsers = this.properties.userRoles.map(u => u.userId);
              return dao.users
                .filter(user => !existingUsers.includes(user.id))
                .map(user => new User(user.id, user.email));
            })
          )
          .subscribe(users => {
              this.properties.users = users;
              console.log(this.properties.users);
            }
          );
        this.reqPropsService.getRequestStates()
          .pipe(map(dao => dao.states
            .filter(s => s.state !== result.requests.state)
            .map(s => s.state)))
          .subscribe(s => {
              this.properties.states = s;
            },
            error => {
              console.log(error);
            });
        this.reqPropsService.getRequestStatesCsl()
          .pipe(map(dao => dao.statesCsl
            .filter(s => s.stateCsl !== result.requests.stateCSL)
            .map(s => s.stateCsl)))
          .subscribe(s => {
              this.properties.statesCsl = s;
            },
            error => {
              console.log(error);
            });
        this.reqPropsService.getRequestProjects()
          .pipe(map(dao => dao.projects
            .filter(p => p.project !== result.requests.project)
            .map(p => p.project)))
          .subscribe(p => {
              this.properties.projects = p;
            },
            error => {
              console.log(error);
            });

        this.reqPropsService.getRequestSkills()
          .pipe(map(dao => dao.skills
            .filter(s => s.skill !== result.requests.skill)
            .map(s => s.skill)))
          .subscribe(s => {
              this.properties.skills = s;
            },
            error => {
              console.log(error);
            });

        this.reqPropsService.getRequestProfiles()
          .pipe(map(dao => dao.profiles
            .filter(p => p.profile !== result.requests.profile)
            .map(p => p.profile)))
          .subscribe(p => {
              this.properties.profiles = p;
            },
            error => {
              console.log(error);
            });

        this.reqPropsService.getTargetDates()
          .pipe(map(dao => dao.months
            .filter(m => m.month !== result.requests.targetDate)
            .map(m => m.month)))
          .subscribe(t => {
              this.properties.targetDates = t;
            },
            error => {
              console.log(error);
            });

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
            error => {
              console.log(error);
            });
      });
  }

  /**
   * This function will fetch the request's id either through the state passed from the component
   * all-requests or from the url, if the view isn't forwarded by the previous component.
   * Then it calls the function getRequest with the id obtained.
   */
  ngOnInit() {
    this.properties.requestId = history.state.requestId || this.router.url.split('/')[2];
    this.getRequestAndUsers(this.properties.requestId);
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

  onSubmit() {
    const values = this.properties.userForm.value.userIdx;
    console.log(values);
    this.userService.getRoleIdByName('recruiter').subscribe(dao => {
        const roleId = dao.id;
        values.forEach(idx => {
          this.requestService.addUser(this.properties.requestId, this.properties.users[idx].userId, roleId)
            .subscribe(() => {
                this.alertService.success('Recruiters added to this request successfully!');
                this.getRequestAndUsers(this.properties.requestId);
              }, error => {
                console.log(error);
              }
            );
        });
      }
    );
  }

  onUpdate() {
    const values = this.properties.updateForm.value;
    const body = {
      quantity: values.quantity,
      targetDate: values.targetDate,
      skill: values.skill,
      project: values.project,
      profile: values.profile,
      dateToSendProfile: values.dateToSendProfile,
      mandatoryLanguages: this.properties.mandatoryLanguages
        .filter(l => l.checked && !l.initialCheck)
        .map(l => l.language),
      valuedLanguages: this.properties.valuedLanguages
        .filter(l => l.checked && !l.initialCheck)
        .map(l => l.language)
    };

    this.requestService.updateRequest(this.properties.requestId, body)
      .subscribe(() => {
        this.alertService.success('Updated request details successfully!');
      });
  }

  onLanguageChange(language: LanguageCheckbox, isMandatory: boolean) {
    if (!language.checked) {
      this.requestService.deleteRequestLanguage(this.properties.requestId,
        {language: language.language, isMandatory}).subscribe(
        () => {
          this.alertService.success('Removed Language successfully!');
        }
      );
    }
  }
}
