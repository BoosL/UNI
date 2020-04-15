import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelComponent} from 'ngx-excel';
import {StudentContractLog} from '../../../../models/student-contract-log';

@Component({
  selector: 'student-contract-exchange-record',
  templateUrl: './student-contract-exchange-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentContractExchangeRecordComponent implements OnInit {
  @Input() rules: NgxExcelModelColumnRules<StudentContractLog>;
  @Input() record: StudentContractLog;
  @Input() excel: NgxExcelComponent;
  ngOnInit(): void {
    this.rules.refundableAmount.label = '换前价格';
    this.rules.amount.label = '换后价格';
    this.rules.oldSubjects.label = '换前';
    this.rules.newSubjects.label = '换后';
  }
}
