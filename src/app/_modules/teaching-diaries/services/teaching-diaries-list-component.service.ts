import {Injectable} from '@angular/core';
import {NgxExcelComponentService} from 'ngx-excel';
import {TeacherCurriculumSchedulesModel} from '../model/teacher-curriculum-schedules.model';
import * as moment from 'moment';

@Injectable()
export class TeachingDiariesListComponentService extends NgxExcelComponentService {
  /**
   * 判断
   * @param model 模型
   */
  public canEditDiary(model: TeacherCurriculumSchedulesModel) {
    return  !model.teachingUpdate;
  }
  public privilegeEditDiary(model: TeacherCurriculumSchedulesModel, action: string) {
    return  !model.teachingUpdate;
  }
  public canAddDiary(model: TeacherCurriculumSchedulesModel) {
    const days = moment(model.courseDate, 'YYYY-MM-DD').diff(moment(moment().local().format('YYYY-MM-DD')), 'day');
    // 历史数据才可以填写日志
    return  !model.teachingInsert && days <= -1;
  }
  public privilegeAddDiary(model: TeacherCurriculumSchedulesModel, action: string) {
    return  !model.teachingInsert;
  }
}
