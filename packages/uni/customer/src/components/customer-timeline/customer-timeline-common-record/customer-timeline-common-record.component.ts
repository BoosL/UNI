import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { CustomerTimeline } from '../../../models/customer-timeline.model';
import { NgxExcelComponent } from 'ngx-excel';

@Component({
  selector: 'customer-timeline-common-record',
  templateUrl: './customer-timeline-common-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerTimelineCommonRecordComponent implements OnInit {

  @Input() record: CustomerTimeline;
  @Input() excel: NgxExcelComponent;

  constructor() { }

  ngOnInit() { }

}
