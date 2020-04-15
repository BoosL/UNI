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
  NgxExcelComponentService
} from 'ngx-excel';
import { of } from 'rxjs';
import { delay, map, tap, mergeMap } from 'rxjs/operators';
import { Student, School } from '@uni/core';
import { StudentSchedule } from '../../../../models/student-schedule.model';
import { StudentScheduleService } from '../../../../service/students/student-schedule.service';
import { StudentScheduleComponentService } from '../student-schedules/student-schedule-component.service';



@Component({
  selector: 'student-schedule-edit',
  templateUrl: './student-schedule-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentScheduleService },
    { provide: NgxExcelComponentService, useClass: StudentScheduleComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentScheduleEditComponent implements OnInit {

  rules: NgxExcelModelColumnRules<StudentSchedule>;
  loading = false;
  message = '';
  componentValue: StudentSchedule;

  @Input() relativeStudent: Student;
  @Input() relativeSchool: School;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<StudentSchedule[]>,
    protected studentScheduleService: StudentScheduleService
  ) { }

  ngOnInit() {
    this.componentValue = this.studentScheduleService.createModel({
      student: this.relativeStudent
    });
    this.rules = this.studentScheduleService.getRules();
  }


  /**
   * 当表单提交时执行
   */
  confirm() {
    of(null).pipe(
      delay(200),
      map(() => ({
        start_time: this.componentValue.startTime,
        end_time: this.componentValue.endTime,
        week: this.componentValue.week
      })),
      tap(() => {
        this.loading = true;
        this.cdr.detectChanges();
      }),
      mergeMap((payload) => this.studentScheduleService.batchSave(
        Object.assign(payload, { campus_id: this.relativeSchool.id, student_id: this.relativeStudent.id })
      ))
    ).subscribe(
      (studentSchedules) => this.drawRef.close(studentSchedules),
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
