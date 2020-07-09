import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { WebDataRocksPivotComponent } from '../../webdatarocks/webdatarocks.angular4';
import * as WebDataRocks from 'webdatarocks';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  @ViewChild('pivot1') child: WebDataRocksPivotComponent;

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
        // filename: '../../../assets/estatisticas.json'
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
    let tabs = toolbar.getTabs(); // get all tabs from the toolbar
    // toolbar.Labels.save = 'Save Configs';
    toolbar.getTabs = () => {
      tabs = tabs.slice(2);
      tabs[0].handler = () => {
        this.child.webDataRocks.save('configs', 'server', null,
          'http://localhost:8080/hd/statistics/configs?userId=' + this.authService.getUserInfo().userId,
          false);
      };
      // tabs[0].title = 'Save Configs';
      return tabs;
    };
  }
  ngOnInit(): void { }

}
