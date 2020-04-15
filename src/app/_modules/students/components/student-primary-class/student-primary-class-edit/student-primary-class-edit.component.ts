import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import {
  INgxExcelDataSource,
  NgxExcelModelColumnRules,
  NgxExcelComponentService,
} from 'ngx-excel';
import { of, Subject} from 'rxjs';
import { delay, map, tap, mergeMap } from 'rxjs/operators';
import { StudentsPrimaryClass } from '@uni/student';
import {StudentPrimaryClassEditDataService} from './student-primary-class-edit-data.service';

@Component({
  selector: 'student-primary-class-edit',
  templateUrl: './student-primary-class-edit.component.html',
  providers: [
    StudentPrimaryClassEditDataService,
    { provide: INgxExcelDataSource, useExisting: StudentPrimaryClassEditDataService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentPrimaryClassEditComponent implements OnInit, AfterViewInit {

  componentValue: StudentsPrimaryClass;
  rules: NgxExcelModelColumnRules<StudentsPrimaryClass>;
  loading = false;
  message = '';
  schoolId: string;
  schoolId$ =  new Subject<string>();

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<StudentsPrimaryClass>,
    protected componentService: NgxExcelComponentService,
    protected studentPrimaryClassService: StudentPrimaryClassEditDataService,
  ) { }

  ngOnInit() {
    this.rules = this.studentPrimaryClassService.getRules();
    this.componentValue = this.studentPrimaryClassService.createModel();
  }

  ngAfterViewInit() { }

  public handleContextChange(event: StudentsPrimaryClass) {
    this.schoolId$.next(event.school ? event.school.id : '');
  }
  public handleChange(value) {
    // tslint:disable: no-string-literal
    this.componentValue['studentsClass'] = value;
  }

  /**
   * 当表单提交时执行
   */
  confirm() {
    this.loading = true;
    of(null).pipe(
      delay(200),
      mergeMap((payload) => this.studentPrimaryClassService.save(this.componentValue))
    ).subscribe(
      (result) => this.drawRef.close(result),
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
