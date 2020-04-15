import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  INgxExcelDataSource,
  NgxExcelModelColumnRules,
} from 'ngx-excel';
import { StudentTransferSchoolDetails } from '../../../../models/student-transfer-school.model';
import { StudentChangeSchoolDetailsService } from '../../../../service/students/student-transfer-school-details.service';

@Component({
  selector: 'student-change-school-details',
  templateUrl: './student-change-school-details.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentChangeSchoolDetailsService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentChangeSchoolDetailsComponent implements OnInit {
  rules: NgxExcelModelColumnRules<StudentTransferSchoolDetails>;
  context: StudentTransferSchoolDetails;

  @Input() changeSchool: StudentTransferSchoolDetails;

  constructor(
    protected studentChangeSchoolDetailsService: StudentChangeSchoolDetailsService,
  ) { }

  ngOnInit() {
    this.rules = this.studentChangeSchoolDetailsService.getRules();
    this.context = this.changeSchool || this.studentChangeSchoolDetailsService.createModel();
    this.context.customSpread = '10000元';
  }


}
