import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { WebDataRocksPivotComponent } from '../../webdatarocks/webdatarocks.angular4';
import * as WebDataRocks from 'webdatarocks';

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
    //console.log('[customizeCell] WebDataRocksPivot');
    if (data.isClassicTotalRow) cell.addClass('fm-total-classic-r');
    if (data.isGrandTotalRow) cell.addClass('fm-grand-total-r');
    if (data.isGrandTotalColumn) cell.addClass('fm-grand-total-c');
  }

  onReportComplete(): void {
    this.child.webDataRocks.off('reportcomplete');
    this.child.webDataRocks.setReport({
      dataSource: {
        filename: 'https://cdn.webdatarocks.com/data/data.json'
      }
    });
  }

  customizeToolbar(toolbar) {
    const tabs = toolbar.getTabs(); // get all tabs from the toolbar
    console.log(tabs);
    toolbar.getTabs = () => {
      delete tabs[0]; // delete the first tab
      delete tabs[1]; // delete the second tab
      return tabs;
    };
  }
  constructor() {
  }
  ngOnInit(): void { }

}
