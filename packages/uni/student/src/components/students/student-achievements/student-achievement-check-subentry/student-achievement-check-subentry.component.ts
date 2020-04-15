import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Input,
  AfterViewInit
} from '@angular/core';
import {
  INgxExcelDataSource,
  NgxExcelComponent,
} from 'ngx-excel';
import { StudentAchievementEditSubentryDataService } from './student-achievement-subentry-data.service';
import { StudentAchievements } from '../../../../models/student-achievements.model';



@Component({
  selector: 'student-achievement-check-subentry',
  templateUrl: './student-achievement-check-subentry.component.html',
  providers: [
    StudentAchievementEditSubentryDataService,
    { provide: INgxExcelDataSource, useExisting: StudentAchievementEditSubentryDataService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentAchievementCheckSubentryComponent implements OnInit, AfterViewInit {

  @Input() achievement: StudentAchievements;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected excel: StudentAchievementEditSubentryDataService
  ) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.excel.bindDataSet(this.achievement.subjects);
    this.excelComponent.reload();
  }



}
