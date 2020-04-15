import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {NgxExcelModelColumnRules, NgxExcelComponent} from 'ngx-excel';
import {StudentContractLog} from '../../../../models/student-contract-log';

@Component({
  selector: 'student-contract-purchase-record',
  templateUrl: './student-contract-purchase-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentContractPurchaseRecordComponent {
  @Input() rules: NgxExcelModelColumnRules<StudentContractLog>;
  @Input() record: StudentContractLog;
  @Input() excel: NgxExcelComponent;
}
