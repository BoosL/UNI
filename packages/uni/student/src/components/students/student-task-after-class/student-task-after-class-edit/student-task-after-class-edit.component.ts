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
import { of } from 'rxjs';
import { delay, map, tap, mergeMap } from 'rxjs/operators';
import { StudentTaskAfterClass } from '../../../../models/student-task-after-class.model';
import { StudentTaskAfterClassService } from '../../../../service/students/student-task-after-class.service';


@Component({
  selector: 'student-task-after-class-edit',
  templateUrl: './student-task-after-class-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentTaskAfterClassService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentTaskAfterClassEditComponent implements OnInit {

  componentValue: StudentTaskAfterClass;
  rules: NgxExcelModelColumnRules<StudentTaskAfterClass>;
  loading = false;
  message = '';

  @Input() studentTaskAfterClass: StudentTaskAfterClass;
  @Input() relativeStudentId: string;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<StudentTaskAfterClass>,
    protected studentTaskAfterClassService: StudentTaskAfterClassService
  ) { }

  ngOnInit() {
    this.rules = this.studentTaskAfterClassService.getRules();
    this.componentValue = this.studentTaskAfterClassService.createModel();
    this.componentValue.status = this.studentTaskAfterClass.status;
    this.componentValue.task = this.studentTaskAfterClass.task;
    this.componentValue.remark = this.studentTaskAfterClass.remark;
  }


  /**
   * 当表单提交时执行
   */
  confirm() {
    const afterClassesId = this.studentTaskAfterClass.actId;
    of(null).pipe(
      delay(200),
      map(() => ({
        acext_id: this.studentTaskAfterClass.id,
        status: this.componentValue.status,
        task: this.componentValue.task,
        remark: this.componentValue.remark,
      })),
      tap(() => {
        this.loading = true;
        this.cdr.detectChanges();
      }),
      mergeMap((payload) => this.studentTaskAfterClassService.save(
        Object.assign(payload, { studentId: this.relativeStudentId }),
        afterClassesId
      ))
    ).subscribe(
      (studentTaskAfterClass) => this.drawRef.close(studentTaskAfterClass),
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
