import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import {
  INgxExcelDataSource,
  NgxExcelModelColumnRules,
} from 'ngx-excel';
import { map, tap, mergeMap, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { StudentFeedback } from '../../../../models/student-feedbacks.model';
import { StudentFeedBackService } from '../../../../service/students/student-feedbacks.service';

@Component({
  selector: 'student-feedback-edit',
  templateUrl: './student-feedback-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentFeedBackService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentFeedbackEditComponent implements OnInit {

  rules: NgxExcelModelColumnRules<StudentFeedback>;
  loading = false;
  message = '';
  componentValue: StudentFeedback;

  @Input() studentId: string;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<StudentFeedback[]>,
    protected studentFeedBackService: StudentFeedBackService
  ) { }

  ngOnInit() {
    this.rules = this.studentFeedBackService.getRules();
    this.componentValue = this.studentFeedBackService.createModel();
  }


  /**
   * 当表单提交时执行
   */
  confirm() {
    of(null).pipe(
      delay(200),
      map(() => ({
        id: this.componentValue.id,
        curriculum_type: this.componentValue.type['value'],
        content: this.componentValue.content,
      })),
      tap(() => {
        this.loading = true;
        this.cdr.detectChanges();
      }),
      mergeMap((payload) => this.studentFeedBackService.batchSave(
        Object.assign(payload, { studentId: this.studentId })
      ))
    ).subscribe(
      (studentFeedback) => this.drawRef.close(studentFeedback),
      (e) => {
        this.loading = false;
        this.message = e.message || '系统错误,请联系管理员';
        this.cdr.markForCheck();
      }
    );
  }

  dismiss() {
    this.drawRef.close();
  }

}
