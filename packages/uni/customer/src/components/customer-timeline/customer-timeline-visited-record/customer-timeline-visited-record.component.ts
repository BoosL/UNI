import { Component, OnInit, ChangeDetectionStrategy, Input, AfterViewInit } from '@angular/core';
import { INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelComponent } from 'ngx-excel';
import {
  CustomerVisitedRecord,
} from '../../../models/customer-visited-record.model';
import {CustomerVisitedRecordService} from '../../../services/customer-visited-record.service';

@Component({
  selector: 'customer-timeline-visited-record',
  templateUrl: './customer-timeline-visited-record.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CustomerVisitedRecordService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerTimelineVisitedRecordComponent implements OnInit {

  rules: NgxExcelModelColumnRules<CustomerVisitedRecord>;

  @Input() record: CustomerVisitedRecord;
  @Input() excel: NgxExcelComponent;

  constructor(
    protected customerVisitedRecordService: CustomerVisitedRecordService
  ) { }

  ngOnInit() {
    this.rules = this.customerVisitedRecordService.getRules();
  }

}
