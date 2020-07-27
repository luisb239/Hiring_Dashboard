import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StatisticsService } from 'src/app/services/statistics/statistics.service';
import { StatisticsProfilesProps } from './statistics-profiles-props';
import { ConfigProfile } from 'src/app/model/statistics/config-profile';
import { FormBuilder } from '@angular/forms';
import {AlertService} from '../../services/alert/alert.service';

@Component({
  selector: 'app-statistics-profiles',
  templateUrl: './statistics-profiles.component.html',
  styleUrls: ['./statistics-profiles.component.css']
})
export class StatisticsProfilesComponent implements OnInit {

  @Input() userId: number;
  @Input() isSave: boolean;
  @Input() inputReport: any;
  @Output() profileChosen = new EventEmitter<ConfigProfile>();
  properties: StatisticsProfilesProps = new StatisticsProfilesProps();

  constructor(
    public activeModal: NgbActiveModal,
    public statisticsService: StatisticsService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
    ) { }

  ngOnInit(): void {
    // this.requestService.getRequest(this.request.id)
    //   .pipe(map(dao => {
    //     return dao.processes
    //       .map(processDao => processDao.candidate.id);
    //   }))
    //   .subscribe(result => {
    //     this.existingCandidates = result;
    //     this.getAllCandidates();
    //   }, error => console.log(error));

    this.statisticsService.getConfigProfiles(this.userId)
      .subscribe(daos => {
        this.properties.configProfiles = daos.configs.map(configDao => new ConfigProfile(configDao.userId, configDao.profileName));
      }, error => {
        console.log(error);
      });
    this.properties.form = this.formBuilder.group({
      createProfileForm: this.formBuilder.control(''),
      getProfileForm: this.formBuilder.control('')
    });
    // this.statisticsService.getConfigProfiles(this.userId)
    //   .subscribe(configDaos => {
    //     this.properties.configProfiles =
    //       configDaos.configs.map(dao => new ConfigProfile(dao.userId, dao.profileName));
    //   }, error => {
    //     console.log(error);
    //   });
    // this.properties.form = this.formBuilder.group({
    //   createProfileForm: this.formBuilder.control(''),
    //   getProfileForm: this.formBuilder.control('')
    // });
  }

  createProfile() {
    const value = this.properties.form.value;
    const body = {
      name: value.createProfileForm,
      report: this.inputReport
    };
    this.statisticsService.saveConfigProfile(this.userId, body)
      .subscribe(result => {
        this.alertService.success(`Profile ${result.id.profileName} created for user ${result.id.userId}`);
      }, error => {
        alert(error);
        console.log(error);
      });
  }

  chooseProfile() {
    const value = this.properties.form.value;
    this.statisticsService.getConfigProfileDetails(this.userId, value.getProfileForm)
      .subscribe(configDao => {
        this.properties.currentProfile =
          new ConfigProfile(configDao.userId, configDao.profileName, configDao.configs);
        this.profileChosen.emit(this.properties.currentProfile);
      }, error => {
        console.log(error);
      });
  }

}
