import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelComponent } from 'ngx-excel';
import { CustomerReservedRecordService } from '../../../services/customer-reserved-record.service';
import { CustomerReservedRecord } from '../../../models/customer-reserved-record.model';

@Component({
  selector: 'customer-timeline-reserved-record',
  templateUrl: './customer-timeline-reserved-record.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CustomerReservedRecordService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerTimelineReservedRecordComponent implements OnInit {

  rules: NgxExcelModelColumnRules<CustomerReservedRecord>;

  @Input() record: CustomerReservedRecord;
  @Input() excel: NgxExcelComponent;

  constructor(
    protected customerReservedRecordService: CustomerReservedRecordService
  ) { }

  ngOnInit() {
    this.rules = this.customerReservedRecordService.getRules();
  }
}
