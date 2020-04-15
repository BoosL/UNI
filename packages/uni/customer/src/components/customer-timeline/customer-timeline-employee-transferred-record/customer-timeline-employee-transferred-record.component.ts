import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelComponent } from 'ngx-excel';
import { EmployeeService, Employee } from '@uni/core';
import { CustomerEmployeeTransferredRecord } from '../../../models/customer-employee-transferred-record.model';

@Component({
  selector: 'customer-timeline-employee-transferred-record',
  templateUrl: './customer-timeline-employee-transferred-record.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: EmployeeService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerTimelineEmployeeTransferredRecordComponent implements OnInit {

  rules: NgxExcelModelColumnRules<Employee>;

  @Input() record: CustomerEmployeeTransferredRecord;
  @Input() excel: NgxExcelComponent;

  constructor(
    protected employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.rules = this.employeeService.getRules();
  }

}
