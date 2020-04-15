import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import { NgxExcelModelColumnRules, INgxExcelDataSource, NgxExcelComponentService, NgxExcelContextChanged } from 'ngx-excel';
import { School, TeacherScheduleService, TeacherSchedule } from '@uni/core';
import { TeacherScheduleEditComponentService } from '../../services/teacher-schedule-edit-component.service';
import { catchError, delay, mergeMap} from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'teacher-schedule-edit',
  templateUrl: './teacher-schedule-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: TeacherScheduleService },
    { provide: NgxExcelComponentService, useClass: TeacherScheduleEditComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherScheduleEditComponent implements OnInit {

  rules: NgxExcelModelColumnRules<TeacherSchedule>;
  loading = false;
  message = '';

  @Input() teacherSchedule: TeacherSchedule;
  @Input() relativeSchool: School;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<TeacherSchedule>,
    protected teacherScheduleService: TeacherScheduleService,
    protected componentService: NgxExcelComponentService
  ) { }

  ngOnInit() {
    this.teacherSchedule = this.teacherSchedule || this.teacherScheduleService.createModel({ relativeSchool: this.relativeSchool });
    this.rules = this.teacherScheduleService.getRules();
  }

  confirm() {
    this.loading = true;
    of(this.teacherSchedule).pipe(
      delay(200),
      mergeMap( (model) => {
        return (this.componentService as TeacherScheduleEditComponentService).append(this.teacherSchedule);
      })
    ).subscribe((teacherSchedule) => {
      this.loading = false;
      this.cdr.markForCheck();
      if (!teacherSchedule) { return; }
      this.drawRef.close(teacherSchedule);
    });
  }

  dismiss() {
    this.drawRef.close();
  }

}
