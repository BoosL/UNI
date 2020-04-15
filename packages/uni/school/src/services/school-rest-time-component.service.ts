import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { SchoolRestTime } from '../models/school.model';
import { SchoolRestTimeService } from '../_services/school-rest-time.service';
import { utc } from 'moment';
import { map } from 'rxjs/operators';

@Injectable()
export class SchoolRestTimeComponentService extends NgxExcelComponentService {

  constructor(
    private schoolRestTimeService: SchoolRestTimeService
  ) {
    super();
  }

  /**
   * 删除行
   * @param model 待删除的模型
   */
  public removeRow(model: SchoolRestTime) {
    return this.schoolRestTimeService.destroy(model, { schoolId: model.relativeSchool.id }).pipe(
      map((schoolRestTime) => [{ action: 'removed', context: schoolRestTime }])
    );
  }

  /**
   * 验证开始时间输入的正确性
   * @param schoolRestTime 校区的休息时间模型
   * @param startTime 开始时间
   */
  public validateStartTime(schoolRestTime: SchoolRestTime, newValue: string) {
    if (!schoolRestTime) { return '当前状态不可变更开始时间'; }
    if (!newValue) { return '请输入开始时间'; }
    if (schoolRestTime.endTime) {
      const startTimeObj = utc(newValue, 'HH:mm');
      const endTimeObj = utc(schoolRestTime.endTime, 'HH:mm');
      if (!startTimeObj.isValid()) { return '格式错误，请核实输入内容'; }
      if (startTimeObj.isAfter(endTimeObj)) { return '开始时间不能大于结束时间'; }
    }
    return true;
  }

  /**
   * 验证结束时间输入的正确性
   * @param schoolRestTime 校区的休息时间模型
   * @param endTime 结束时间
   */
  public validateEndTime(schoolRestTime: SchoolRestTime, newValue: string) {
    if (!schoolRestTime) { return '当前状态不可变更结束时间'; }
    if (!newValue) { return '请输入结束时间'; }
    if (schoolRestTime.startTime) {
      const startTimeObj = utc(schoolRestTime.startTime, 'HH:mm');
      const endTimeObj = utc(newValue, 'HH:mm');
      if (!endTimeObj.isValid()) { return '格式错误，请核实输入内容'; }
      if (endTimeObj.isBefore(startTimeObj)) { return '结束时间不能小于开始时间'; }
    }
    return true;
  }

}
