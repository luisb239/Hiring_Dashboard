import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {StatisticsService} from 'src/app/services/statistics/statistics.service';
import {StatisticsProfilesProps} from './statistics-profiles-props';
import {ConfigProfile} from 'src/app/model/statistics/config-profile';
import {FormBuilder} from '@angular/forms';
import {AlertService} from '../../services/alert/alert.service';

@Component({
  selector: 'app-statistics-profiles',
  templateUrl: './statistics-profiles.component.html',
  styleUrls: ['./statistics-profiles.component.css']
})
export class StatisticsProfilesComponent implements OnInit {

  @Input() isSave: boolean;
  @Input() inputReport: any;
  @Output() profileChosen = new EventEmitter<ConfigProfile>();
  properties: StatisticsProfilesProps = new StatisticsProfilesProps();

  constructor(
    public activeModal: NgbActiveModal,
    public statisticsService: StatisticsService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.statisticsService.getUserConfigProfiles()
      .subscribe(result => {
        this.properties.configProfiles = result.configs.map(configDao => new ConfigProfile(configDao.profileName));
      }, error => {
        console.log(error);
      });
    this.properties.form = this.formBuilder.group({
      createProfileForm: this.formBuilder.control(''),
      getProfileForm: this.formBuilder.control('')
    });
  }

  createProfile() {
    const value = this.properties.form.value;
    const body = {
      name: value.createProfileForm,
      report: this.inputReport
    };
    this.statisticsService.saveUserConfigProfiles(body)
      .subscribe(result => {
        this.alertService.success(`Profile ${result.id.profileName} created.`);
        this.activeModal.close('Close click');
      }, error => {
        alert(error);
        console.log(error);
      });
  }

  chooseProfile() {
    const value = this.properties.form.value;
    this.statisticsService.getUserConfigProfileDetails(value.getProfileForm)
      .subscribe(configDao => {
        this.properties.currentProfile =
          new ConfigProfile(configDao.profileName, configDao.configs);
        this.activeModal.close('Close click');
        this.profileChosen.emit(this.properties.currentProfile);
      }, error => {
        console.log(error);
      });
  }

}
