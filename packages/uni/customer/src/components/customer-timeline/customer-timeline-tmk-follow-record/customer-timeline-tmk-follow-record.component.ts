import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { INgxExcelDataSource, NgxExcelComponent, NgxExcelModelColumnRules } from 'ngx-excel';
import { CustomerCompatibleFollowRecord } from '../../../models/customer-compatible-follow-record.model';
import {CustomerCompatibleFollowRecordService} from '../../../services/customer-compatible-follow-record.service';

@Component({
  selector: 'customer-timeline-tmk-follow-record',
  templateUrl: './customer-timeline-tmk-follow-record.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CustomerCompatibleFollowRecordService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerTimelineTmkFollowRecordComponent implements OnInit {

  rules: NgxExcelModelColumnRules<CustomerCompatibleFollowRecord>;

  @Input() record: CustomerCompatibleFollowRecord;
  @Input() excel: NgxExcelComponent;

  constructor(
    protected customerCompatibleFollowRecordService: CustomerCompatibleFollowRecordService
  ) { }

  ngOnInit() {
    this.rules = this.customerCompatibleFollowRecordService.getRules();
  }

}
