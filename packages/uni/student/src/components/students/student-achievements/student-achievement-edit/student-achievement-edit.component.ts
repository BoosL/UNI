import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import {
  INgxExcelDataSource,
  NgxExcelModelColumnRules,
} from 'ngx-excel';
import { of } from 'rxjs';
import { delay, map, mergeMap, tap } from 'rxjs/operators';
import { StudentAchievements, StudentSubjects } from '../../../../models/student-achievements.model';
import { StudentAchievementsService } from '../../../../service/students/student-achevements.service';

@Component({
  selector: 'student-achievement-edit',
  templateUrl: './student-achievement-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentAchievementsService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentAchievementEditComponent implements OnInit {

  componentValue: StudentAchievements;
  rules: NgxExcelModelColumnRules<StudentAchievements>;
  loading = false;
  message = '';
  subjectsValue: StudentSubjects;

  @Input() studentId: string;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<StudentAchievements[]>,
    protected studentAchievementsService: StudentAchievementsService,
  ) { }

  ngOnInit() {
    this.rules = this.studentAchievementsService.getRules();
    this.componentValue = this.studentAchievementsService.createModel();
    this.rules.totalPoints.label = '总分数';
  }



  public handleChange(value: StudentSubjects) {
    this.subjectsValue = value;
  }


  /**
   * 当表单提交时执行
   */
  confirm() {
    of(null).pipe(
      delay(200),
      map(() => ({
        exam_date: this.componentValue.testDate,
        is_progressed: this.componentValue.isProgressed,
        is_qualified: this.componentValue.isQualified,
        remark: this.componentValue.remark,
        result_date: this.componentValue.resultDate,
        subjects: this.subjectsValue,
        total_score: this.componentValue.totalPoints,
        type: this.componentValue.type ? this.componentValue.type['value'] : '',
      })),
      tap(() => {
        this.loading = true;
        this.cdr.detectChanges();
      }),
      mergeMap((payload) => this.studentAchievementsService.batchSave(
        Object.assign(payload, { studentId: this.studentId })
      ))
    ).subscribe(
      (studentAchievements) => {
        this.drawRef.close(studentAchievements);
      },
      (e) => {
        this.loading = false;
        this.message = e.message || '系统错误，请联系管理员';
        this.cdr.detectChanges();
      }
    );
  }

  dismiss() {
    this.drawRef.close();
  }

}
