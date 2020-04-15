import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import {
  INgxExcelDataSource,
  NgxExcelModelColumnRules,
} from 'ngx-excel';
import { StudentFeedback } from '../../../../models/student-feedbacks.model';
import { StudentFeedBackService } from '../../../../service/students/student-feedbacks.service';

@Component({
  selector: 'student-feedback-check',
  templateUrl: './student-feedback-check.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentFeedBackService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentFeedbackCheckComponent implements OnInit {
  rules: NgxExcelModelColumnRules<StudentFeedback>;
  @Input() feedback: StudentFeedback;

  constructor(
    protected drawRef: NzDrawerRef<StudentFeedback>,
    protected studentFeedBackService: StudentFeedBackService,
  ) { }

  ngOnInit() {
    this.rules = this.studentFeedBackService.getRules();
  }


  dismiss() {
    this.drawRef.close();
  }

}
