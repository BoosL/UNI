import {Injectable} from '@angular/core';
import {NgxExcelComponentService} from 'ngx-excel';
import {AutoCourses} from '../models/auto-courses';
import {CurriculumSchedulesAutoCoursesService} from '../_services/curriculum-schedules-auto-courses.service';

@Injectable()
export class CurriculumSchedulesAutoCoursesComponentService extends NgxExcelComponentService {
  constructor(
    private autoCoursesService: CurriculumSchedulesAutoCoursesService,
  ) {
    super();
  }
  /**
   * 判断是否能编辑原来的用途
   * @param model 模型
   */
  public canEditScheduleTime(model: AutoCourses) {
    const types = this.autoCoursesService.getVipAutoTypes();
    let bool = false;
    for (const item of types) {
      if (model.type && model.type.value === item.value) {
        bool = true;
        break;
      }
    }
    return bool;
  }
  public canEditScheduleWeek(model: AutoCourses) {
    const types = this.autoCoursesService.getEtpAutoTypes();
    let bool = false;
    for (const item of types) {
      if (model.type && model.type.value === item.value) {
        bool = true;
        break;
      }
    }
    return bool;
  }

}
