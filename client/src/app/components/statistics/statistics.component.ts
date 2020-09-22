import {Component, ViewChild} from '@angular/core';
import {WebDataRocksPivotComponent} from '../../webdatarocks/webdatarocks.angular4';
import * as WebDataRocks from 'webdatarocks';
import {AuthService} from '../../services/auth/auth.service';
import {StatisticsProps} from './statistics-props';
import {StatisticsProfilesComponent} from '../statistics-profiles/statistics-profiles.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StatisticsService} from 'src/app/services/statistics/statistics.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  @ViewChild('pivot1') child: WebDataRocksPivotComponent;
  properties: StatisticsProps = new StatisticsProps();
  currentProfileName: string;

  onCustomizeCell(cell: WebDataRocks.CellBuilder, data: WebDataRocks.CellData): void {
    if (data.isClassicTotalRow) {
      cell.addClass('fm-total-classic-r');
    }
    if (data.isGrandTotalRow) {
      cell.addClass('fm-grand-total-r');
    }
    if (data.isGrandTotalColumn) {
      cell.addClass('fm-grand-total-c');
    }
  }

  onReportComplete(): void {
    this.child.webDataRocks.off('reportcomplete');
    this.child.webDataRocks.setReport({
      dataSource: {
        dataSourceType: 'json',
        filename: '/hd/statistics'
      },
      options: {
        grid: {
          type: 'compact',
          showTotals: 'off',
          showGrandTotals: 'on'
        }
      },
      slice: {
        rows: [
          {uniqueName: 'project'}, {uniqueName: 'profile'}
        ],
        columns: [
          {
            uniqueName: 'status'
          },
          {
            uniqueName: 'Measures'
          }
        ],
        measures: [{
          uniqueName: 'candidateName',
          aggregation: 'distinctcount'
        }]
      }
    });
  }

  constructor(
    public authService: AuthService,
    public statisticsService: StatisticsService,
    private modalService: NgbModal) {
  }

  customizeToolbar(toolbar) {
    // get all tabs from the toolbar
    let tabs = toolbar.getTabs();
    toolbar.getTabs = () => {
      // removes unnecessary tabs and customizes others
      tabs = tabs.slice(1);
      // Open tab
      tabs[0].menu[1].handler = () => this.openRemotelyHandler();
      tabs[0].menu[0].id = 'my-wdr-tab-open-local-report';
      tabs[0].menu[1].id = 'my-wdr-tab-open-remote-report';
      tabs[0].menu[0].title = 'Open report';
      tabs[0].menu[1].title = 'Open configs';
      // Save tab
      tabs[1].menu = [
        {
          title: 'Save report', id: 'wdr-tab-save-local',
          handler: () => this.saveLocallyHandler(),
          mobile: false, icon: this.properties.save_local
        },
        {
          title: 'Save configs', id: 'wdr-tab-save-remote',
          handler: () => this.saveRemotelyHandler(),
          icon: this.properties.save_remote
        },
      ];
      tabs[1].handler = () => {
      };
      return tabs;
    };
  }

  saveLocallyHandler() {
    this.statisticsService.getStatistics()
      .subscribe(statistics => {
        Object.assign(this.properties.myReport, this.child.webDataRocks.getReport());
        this.properties.myReport.dataSource.data = statistics;
        // delete this.properties.myReport.dataSource.filename;
        const st = JSON.stringify(this.properties.myReport);
        const blob = new Blob([st], {type: 'application/json'});
        saveAs(blob, `My_configs.json`);
      });
  }

  saveRemotelyHandler() {
    const modalRef = this.modalService.open(StatisticsProfilesComponent);
    modalRef.componentInstance.isSave = true;
    modalRef.componentInstance.inputReport = this.child.webDataRocks.getReport();
  }

  openRemotelyHandler() {
    const modalRef = this.modalService.open(StatisticsProfilesComponent);
    modalRef.componentInstance.isSave = false;
    modalRef.componentInstance.currentProfileName = this.currentProfileName || 'Default';
    modalRef.componentInstance.profileChosen.subscribe(
      (profile) => {
        this.child.webDataRocks.setReport(profile.configs);
        this.currentProfileName = profile.profileName;
      });
  }

}
