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
import { StudentTeacherLogComment } from '../../../../models/student-teach-logs.model';
import { StudentTeachLogCommentsService } from '../../../../service/students/student-teach-log-comments.service';



@Component({
  selector: 'student-teach-log-edit',
  templateUrl: './student-teach-log-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentTeachLogCommentsService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentTeachLogsEditComponent implements OnInit {

  rules: NgxExcelModelColumnRules<StudentTeacherLogComment>;
  loading = false;
  message = '';

  @Input() teacherLog: StudentTeacherLogComment[];

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<StudentTeacherLogComment>,
    protected studentTeachLogCommentsService: StudentTeachLogCommentsService
  ) { }

  ngOnInit() {
    this.rules = this.studentTeachLogCommentsService.getRules();
  }


  /**
   * 当表单提交时执行
   */
  confirm() {
    const payload = {

    };
    this.loading = true;
    return this.studentTeachLogCommentsService.save(
      Object.assign(payload, {

      })
    ).subscribe(
      (teacherLogComment) =>
        this.drawRef.close(teacherLogComment),
      (e) => {
        this.loading = false;
        this.message = e.message || '系统错误，请联系管理员';
        this.cdr.markForCheck();
      }
    );
  }

  dismiss() {
    this.drawRef.close();
  }

}
