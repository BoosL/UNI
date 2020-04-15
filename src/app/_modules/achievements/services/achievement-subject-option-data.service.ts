import {Injectable} from '@angular/core';
import {NgxExcelDataService} from 'ngx-excel';
import {AchievementSubject} from '../model/achievement.model';
import { AchievementSubjectService} from '../_services/achievements.service';

@Injectable()
export class AchievementSubjectOptionDataService extends NgxExcelDataService<AchievementSubject> {
  // tslint:disable: variable-name
  constructor(
    protected achievementSubjectService: AchievementSubjectService,
  ) {
    super();
  }

  /**
   * @inheritdoc
   */
  public getRules() {
    return this.achievementSubjectService.getRules();
  }
}
