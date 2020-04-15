import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import {
  INgxExcelDataSource,
  NgxExcelModelColumnRules,
} from 'ngx-excel';
import { Subscription, of } from 'rxjs';
import { map, mergeMap, delay, tap } from 'rxjs/operators';
import { StudentCcFollows } from '../../../../../models/student-follows.model';
import { StudentCcFollowsEditService } from '../../../../../service/students/student-cc-follows-edit.service';

@Component({
  selector: 'student-cc-follow-edit',
  templateUrl: './student-cc-follow-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentCcFollowsEditService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentCcFollowEditComponent implements OnInit {

  componentValue: StudentCcFollows;
  rules: NgxExcelModelColumnRules<StudentCcFollows>;
  loading = false;
  message = '';

  protected subscription = new Subscription();
  @Input() relativeStudentId: string;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<StudentCcFollows[]>,
    protected studentCcFollowsEditService: StudentCcFollowsEditService,
  ) { }

  ngOnInit() {
    this.rules = this.studentCcFollowsEditService.getRules();
    this.componentValue = this.studentCcFollowsEditService.createModel({});
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
      delay(200),
      map(() => ({
        content: this.componentValue.remark,
        next_time: this.componentValue.nextTime,
        recording_id: this.componentValue.attachments
      })),
      tap(() => {
        this.loading = true;
        this.cdr.detectChanges();
      }),
      mergeMap((payload) => this.studentCcFollowsEditService.batchSave(
        Object.assign(payload, { studentId: this.relativeStudentId })
      )),
    ).subscribe(
      (studentCcFollows) => this.drawRef.close(studentCcFollows),
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
