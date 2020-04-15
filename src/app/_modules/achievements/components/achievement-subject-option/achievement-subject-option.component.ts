import {
  Component,
  OnInit,
  ChangeDetectionStrategy, Input, ViewChild, AfterViewInit,
} from '@angular/core';
import {AchievementModel} from '../../model/achievement.model';
import {INgxExcelDataSource, NgxExcelComponent, NgxExcelModelColumnRules} from 'ngx-excel';
import {AchievementSubjectOptionDataService} from '../../services/achievement-subject-option-data.service';

@Component({
  selector: 'achievement-subject-option',
  templateUrl: './achievement-subject-option.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: INgxExcelDataSource, useExisting: AchievementSubjectOptionDataService },
  ]
})
export class AchievementSubjectOptionComponent implements OnInit, AfterViewInit {
  public rules: NgxExcelModelColumnRules<AchievementModel>
  @Input() achievement: AchievementModel;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;
  constructor(
    protected excel: AchievementSubjectOptionDataService,
  ) {
  }
  ngOnInit() {}
  ngAfterViewInit(): void {
    this.excel.bindDataSet(this.achievement.subjects);
    this.excelComponent.reload();

  }
}
