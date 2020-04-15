import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { utc } from 'moment';
import { NgxExcelComponentService } from 'ngx-excel';
import { StudentSchedule } from '../../../../models/student-schedule.model';
import { StudentScheduleService } from '../../../../service/students/student-schedule.service';



@Injectable()
export class StudentScheduleComponentService extends NgxExcelComponentService {

  constructor(
    protected studentScheduleService: StudentScheduleService,
  ) {
    super();
  }


  /**
   * 删除上课频率
   * @param model 待删除的上课频率
   */
  public removeRow(model) {
    return this.studentScheduleService.batchDestroy(
      Object.assign({}, { campus_id: model.campus_id, student_id: model.student.id }, model.id),
    ).pipe(
      map((studentClassFrequency: StudentSchedule[]) => {
        return [{ action: 'destoryed', contexts: studentClassFrequency }];
      })
    );
  }



  /**
   * 验证开始时间输入的正确性
   * @param studnetTime 学员的时间管理模型
   * @param startTime 开始时间
   */
  public validateStartTime(studentSchedule: StudentSchedule, newValue: string) {
    if (!studentSchedule) { return '当前状态不可变更开始时间'; }
    if (!newValue) { return '请输入开始时间'; }
    if (studentSchedule.endTime) {
      const startTimeObj = utc(newValue, 'HH:mm');
      const endTimeObj = utc(studentSchedule.endTime, 'HH:mm');
      if (!startTimeObj.isValid()) { return '格式错误，请核实输入内容'; }
      if (startTimeObj.isAfter(endTimeObj)) { return '开始时间不能大于结束时间'; }
    }
    return true;
  }

  /**
   * 验证结束时间输入的正确性
   * @param studnetTime 学员的时间管理模型
   * @param endTime 结束时间
   */
  public validateEndTime(studentSchedule: StudentSchedule, newValue: string) {
    if (!studentSchedule) { return '当前状态不可变更结束时间'; }
    if (!newValue) { return '请输入结束时间'; }
    if (studentSchedule.startTime) {
      const startTimeObj = utc(studentSchedule.startTime, 'HH:mm');
      const endTimeObj = utc(newValue, 'HH:mm');
      if (!endTimeObj.isValid()) { return '格式错误，请核实输入内容'; }
      if (endTimeObj.isBefore(startTimeObj)) { return '结束时间不能小于开始时间'; }
    }
    return true;
  }


}
