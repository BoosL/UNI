import {Injectable} from '@angular/core';
import {NgxExcelDataService} from 'ngx-excel';
import {TeacherCurriculumSchedulesModel} from '../model/teacher-curriculum-schedules.model';
import {TeacherCurriculumSchedulesService} from '../_services/teacher-curriculum-schedules.service';

@Injectable()
export class TeachingDiariesListDataService extends NgxExcelDataService<TeacherCurriculumSchedulesModel> {


  constructor(
    protected teacherCurriculumSchedulesService: TeacherCurriculumSchedulesService,
  ) {
    super();
  }

  /**
   * @inheritdoc
   */
  public getRules() {
    return this.teacherCurriculumSchedulesService.getRules();
  }

}
