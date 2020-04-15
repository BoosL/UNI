import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelComponent} from 'ngx-excel';
import {StudentContractLog} from '../../../../models/student-contract-log';

@Component({
  selector: 'student-contract-refund-record',
  templateUrl: './student-contract-refund-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentContractRefundRecordComponent implements  OnInit {
  @Input() rules: NgxExcelModelColumnRules<StudentContractLog>;
  @Input() record: StudentContractLog;
  @Input() excel: NgxExcelComponent;
  ngOnInit(): void {
    this.rules.newSubjects.label = '科目';
  }
}
