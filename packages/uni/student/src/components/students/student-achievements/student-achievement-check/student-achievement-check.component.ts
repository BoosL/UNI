import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import {
  INgxExcelDataSource,
  NgxExcelModelColumnRules,
} from 'ngx-excel';
import { StudentAchievements } from '../../../../models/student-achievements.model';
import { StudentAchievementsService } from '../../../../service/students/student-achevements.service';


@Component({
  selector: 'student-achievement-check',
  templateUrl: './student-achievement-check.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentAchievementsService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentAchievementCheckComponent implements OnInit {
  rules: NgxExcelModelColumnRules<StudentAchievements>;
  @Input() achievement: StudentAchievements;

  constructor(
    protected drawRef: NzDrawerRef<StudentAchievements>,
    protected studentAchievementsService: StudentAchievementsService,
  ) { }

  ngOnInit() {
    this.rules = this.studentAchievementsService.getRules();
  }


  dismiss() {
    this.drawRef.close();
  }

}
