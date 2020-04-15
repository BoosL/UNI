import { Injectable } from '@angular/core';
import { NgxExcelDataService } from 'ngx-excel';
import { StudentSubjects } from '../../../../models/student-achievements.model';
import { StudentAchievementSubentryService } from '../student-achievement-edit-subentry/student-achevement-subentry.service';


@Injectable()
export class StudentAchievementEditSubentryDataService extends NgxExcelDataService<StudentSubjects> {

  constructor(
    protected excel: StudentAchievementSubentryService
  ) {
    super();
  }


  /**
   * @inheritdoc
   */
  public getRules() {
    return this.excel.getRules();
  }

  public createModel(attributes?: Partial<StudentSubjects>, o?: any) {
    return this.excel.createModel(attributes, o);
  }



}
