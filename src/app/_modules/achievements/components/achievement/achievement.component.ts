import {
  Component,
  OnInit,
  ChangeDetectionStrategy, Input
} from '@angular/core';
import {AchievementModel} from '../../model/achievement.model';
import {INgxExcelDataSource, NgxExcelModelColumnRules} from 'ngx-excel';
import {AchievementsService} from '../../_services/achievements.service';
import {NzDrawerRef} from 'ng-zorro-antd';

@Component({
  selector: '.achievement',
  templateUrl: './achievement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: INgxExcelDataSource, useExisting: AchievementsService },
  ]
})
export class AchievementComponent implements OnInit {
  public rules: NgxExcelModelColumnRules<AchievementModel>
  @Input() achievement: AchievementModel;
  constructor(
    protected excel: AchievementsService,
    protected drawRef: NzDrawerRef<AchievementModel>,
  ) {
  }
  ngOnInit() {
    this.rules = this.excel.getRules();
  }
  // 关闭抽屉
  public dismiss() {
    this.drawRef.close();
  }
}
