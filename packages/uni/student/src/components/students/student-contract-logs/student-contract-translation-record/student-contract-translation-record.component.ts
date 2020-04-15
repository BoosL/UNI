import {Component, ChangeDetectionStrategy, Input, OnInit} from '@angular/core';
import {NgxExcelModelColumnRules, NgxExcelComponent} from 'ngx-excel';
import {StudentContractLog} from '../../../../models/student-contract-log';
@Component({
  selector: 'student-contract-translation-record',
  templateUrl: './student-contract-translation-record.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentContractTranslationRecordComponent implements  OnInit {
  @Input() rules: NgxExcelModelColumnRules<StudentContractLog>;
  @Input() record: StudentContractLog;
  @Input() excel: NgxExcelComponent;
  ngOnInit(): void {
  this.rules.oldSubjects.label = '平移前';
  this.rules.newSubjects.label = '平移后';
}
}
