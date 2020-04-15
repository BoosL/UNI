import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import {
  INgxExcelDataSource,
  NgxExcelModelColumnRules,
} from 'ngx-excel';
import { Subscription, of } from 'rxjs';
import { map, tap, mergeMap } from 'rxjs/operators';
import { StudentScFollows } from '../../../../../models/student-follows.model';
import { StudentFollowsEditService } from '../../../../../service/students/student-follows-edit.service';
import { StudentFollowsComponentService } from './student-follows-component.service';


@Component({
  selector: 'student-sc-follow-edit',
  templateUrl: './student-sc-follow-edit.component.html',
  providers: [
    StudentFollowsComponentService,
    { provide: INgxExcelDataSource, useExisting: StudentFollowsEditService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentScFollowsEditComponent implements OnInit {

  componentValue: StudentScFollows;
  rules: NgxExcelModelColumnRules<StudentScFollows>;
  loading = false;
  message = '';

  protected subscription = new Subscription();
  @Input() studentFollows: StudentScFollows;
  @Input() relativeStudentId: string;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<StudentScFollows>,
    protected studentFollowsEditService: StudentFollowsEditService,
    protected studentFollowsComponentService: StudentFollowsComponentService,
  ) { }

  ngOnInit() {
    this.rules = this.studentFollowsEditService.getRules();
    this.componentValue = this.studentFollowsEditService.createModel({
      relativeStudent: this.relativeStudentId
    });
  }

  /**
   * 当表单选项发生变化时执行
   * @param changedContexts 行的变化情况
   */
  handleComponentValueChanged(changedContexts) {
    const changedContext = changedContexts.find((context) => context.action === 'updated');
    if (!changedContext || !changedContext.context) { return; }
    const componentValue = changedContext.context;
    this.componentValue = Object.assign({}, componentValue);
  }

  /**
   * 当表单提交时执行
   */
  confirm() {
    of(null).pipe(
      map(() => ({
        title: this.componentValue.theme.type,
        next_time: this.componentValue.nextTime,
        content: this.componentValue.remark,
        student_id: this.relativeStudentId
      })),
      tap(() => {
        this.loading = true,
          this.cdr.detectChanges();
      }),
      mergeMap((payload) => this.studentFollowsEditService.save(
        Object.assign(payload, { studentId: this.relativeStudentId })
      ))
    ).subscribe(
      (studentDeferContract) => this.drawRef.close(studentDeferContract),
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
