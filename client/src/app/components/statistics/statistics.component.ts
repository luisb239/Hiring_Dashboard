import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { WebDataRocksPivotComponent } from '../../webdatarocks/webdatarocks.angular4';
import * as WebDataRocks from 'webdatarocks';
import { AuthService } from '../../services/auth/auth.service';
import { StatisticsProps } from './statistics-props';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  @ViewChild('pivot1') child: WebDataRocksPivotComponent;
  properties: StatisticsProps = new StatisticsProps();

  onPivotReady(pivot: WebDataRocks.Pivot): void {
    console.log('[ready] WebDataRocksPivot', this.child);
  }

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
        filename: 'http://localhost:8080/hd/statistics'
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
          { uniqueName: 'project' }, { uniqueName: 'profile' }
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

  constructor(public authService: AuthService) {
  }

  customizeToolbar(toolbar) {
    // get all tabs from the toolbar
    let tabs = toolbar.getTabs();
    toolbar.getTabs = () => {
      // removes unecessary tabs and adds custom ones
      tabs = tabs.slice(1);
      tabs[0].menu[1].handler = () => this.child.webDataRocks.load(
        `http://localhost:8080/hd/users/${this.authService.getUserInfo().userId}/statistics/configs`);
      tabs[1].menu = [
        {
          title: 'Save locally', id: 'wdr-tab-save-local',
          handler: tabs[1].handler, mobile: false, icon: this.properties.save_local
        },
        {
          title: 'Save remotelly', id: 'wdr-tab-save-remote',
          handler: () => this.child.webDataRocks.save('configs', 'server', null,
            `http://localhost:8080/hd/users/${this.authService.getUserInfo().userId}/statistics/configs`, false),
          icon: this.properties.save_remote
        },
      ];
      tabs[1].handler = () => { };
      // tabs.unshift({
      //   title: 'Load', id: 'wdr-tab-load',
      //   handler: () => this.child.webDataRocks.load(
      //     `http://localhost:8080/hd/users/${this.authService.getUserInfo().userId}/statistics/configs`),
      //   mobile: false, icon: this.properties.loadIcon
      // });
      // tabs.unshift({
      //   title: 'Save', id: 'wdr-tab-save',
      //   handler: () => {
      //     this.child.webDataRocks.save('configs', 'server', null,
      //       `http://localhost:8080/hd/users/${this.authService.getUserInfo().userId}/statistics/configs`,
      //       false);
      //   },
      //   mobile: false, icon: this.properties.saveIcon
      // });
      return tabs;
    };
  }
  ngOnInit(): void { }

}
