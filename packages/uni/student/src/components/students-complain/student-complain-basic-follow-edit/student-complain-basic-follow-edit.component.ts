import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  Input,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  INgxExcelDataSource, NgxExcelComponent, NgxExcelModelColumnRules, NgxExcelColumnType
} from 'ngx-excel';
import { NzDrawerRef } from 'ng-zorro-antd';
import { StudentComplainFollow } from '../../../models/student-complain.model';
import { StudentComplainFollowsService } from '../../../service/students-complain/students-complain-follows.service';
import { delay, map, tap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'student-complain-basic-follow-edit',
  templateUrl: './student-complain-basic-follow-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentComplainFollowsService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentComplainBasicFollowEditComponent implements OnInit, AfterViewInit, OnDestroy {

  componentValue: StudentComplainFollow;
  rules: NgxExcelModelColumnRules<StudentComplainFollow>;
  loading = false;
  message = '';


  @Input() studentId: string;

  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<StudentComplainFollow[]>,
    protected studentComplainFollowsService: StudentComplainFollowsService
  ) { }

  ngOnInit() {
    this.rules = this.studentComplainFollowsService.getRules();
    this.componentValue = this.studentComplainFollowsService.createModel();
    this.rules.status.selectOptions = this.studentComplainFollowsService.getTypes();
  }

  ngAfterViewInit() { }


  ngOnDestroy() { }

  /**
   * 当表单提交时执行
   */
  confirm() {
    of(null).pipe(
      delay(200),
      map(() => ({
        description: this.componentValue.remark,
        folllow_status: this.componentValue.status['value'],
      })),
      tap(() => {
        this.loading = true;
        this.cdr.detectChanges();
      }),
      mergeMap((payload) =>
        this.studentComplainFollowsService.batchSave(
          Object.assign(payload, { student_id: this.studentId })
        )
      )
    ).subscribe(
      (studentsComplainFollows) => this.drawRef.close(studentsComplainFollows),
      (e) => {
        this.loading = false;
        this.message = e.message || '系统错误,请联系管理员';
      }
    );
  }


  dismiss() {
    this.drawRef.close();
  }
}
