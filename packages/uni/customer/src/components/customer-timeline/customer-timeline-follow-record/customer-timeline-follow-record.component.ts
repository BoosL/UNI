import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelComponent } from 'ngx-excel';
import {
  CustomerFollowRecord,
} from '../../../models/customer-follow-record.model';
import {CustomerFollowRecordService} from '../../../services/customer-follow-record.service';

@Component({
  selector: 'customer-timeline-follow-record',
  templateUrl: './customer-timeline-follow-record.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CustomerFollowRecordService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerTimelineFollowRecordComponent implements OnInit {

  rules: NgxExcelModelColumnRules<CustomerFollowRecord>;

  @Input() record: CustomerFollowRecord;
  @Input() excel: NgxExcelComponent;

  constructor(
    protected customerFollowRecordService: CustomerFollowRecordService
  ) { }

  ngOnInit() {
    this.rules = this.customerFollowRecordService.getRules();
    console.log(this.rules, this.record);
  }

}
