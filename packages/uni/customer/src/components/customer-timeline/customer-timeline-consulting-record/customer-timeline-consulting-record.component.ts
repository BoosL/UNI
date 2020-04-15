import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelComponent } from 'ngx-excel';
import {
  CustomerConsultingRecordModel as CustomerConsultingRecord
} from '../../../models/customer-consulting-record.model';
import {CustomerConsultingRecordService} from '../../../services/customer-consulting-record.service';

@Component({
  selector: 'customer-timeline-consulting-record',
  templateUrl: './customer-timeline-consulting-record.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CustomerConsultingRecordService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerTimelineConsultingRecordComponent implements OnInit {

  rules: NgxExcelModelColumnRules<CustomerConsultingRecord>;

  @Input() record: CustomerConsultingRecord;
  @Input() excel: NgxExcelComponent;

  constructor(
    protected customerConsultingRecordService: CustomerConsultingRecordService
  ) { }

  ngOnInit() {
    this.rules = this.customerConsultingRecordService.getRules();
  }

}
