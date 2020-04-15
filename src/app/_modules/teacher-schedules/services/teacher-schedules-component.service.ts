import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { map } from 'rxjs/operators';
import { TeacherScheduleService, TeacherSchedule } from '@uni/core';

@Injectable()
export class TeacherSchedulesComponentService extends NgxExcelComponentService {
  
  constructor(
    private teacherScheduleService: TeacherScheduleService
  ) {
    super();
  }
  /**
   * 判断是否能编辑开始日期
   * @param model 模型
   */
  public canEditStartDate(model: TeacherSchedule) {
    return model.frequency && model.frequency.value === '1';
  }
  /**
   * 判断是否能编辑结束日期
   * @param model 模型
   */
  public canEditEndDate(model: TeacherSchedule) {
    return model.frequency && model.frequency.value === '1';
  }
  /**
   * 判断是否能编辑周几
   * @param model 模型
   */
  public canEditWeek(model: TeacherSchedule) {
    return model.frequency && model.frequency.value === '3';
  }
  /**
   * 删除行
   * @param model 待删除的模型
   */
  public remove(model: TeacherSchedule) {
    const payload = { schoolId: model.relativeSchool.id };
    return this.teacherScheduleService.destroy(model, payload).pipe(
      map((removedModel) => [{ action: 'removed', context: removedModel }])
    );
  }

}
