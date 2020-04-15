import {Injectable} from '@angular/core';
import {NgxExcelComponentService} from 'ngx-excel';
import {CurriculumScheduleModel} from '../models/curriculum-schedule.model';

@Injectable()
export class CurriculumSchedulesEditMinorComponentService extends NgxExcelComponentService {
  /**
   * 判断是否能编辑原来的用途
   * @param model 模型
   */
  public canEditMeetingName(model: CurriculumScheduleModel) {
    return model.teachingType && model.teachingType.value === '3' && this._baseCanEdit(model);
  }

  public canEditMeetingNumber(model: CurriculumScheduleModel) {
    return model.teachingType && model.teachingType.value === '3' && this._baseCanEdit(model);
  }

  public canEditMeetingAccount(model: CurriculumScheduleModel) {
    return model.teachingType && model.teachingType.value === '3' && this._baseCanEdit(model);
  }

  public canEditPackage(model: CurriculumScheduleModel) {
    // tslint:disable-next-line: no-string-literal
    return this._baseCanEdit(model);
  }

  public canEditClassroom(model: CurriculumScheduleModel) {
    // tslint:disable-next-line: no-string-literal
    return this._baseCanEdit(model);
  }

  public canEditRemark(model: CurriculumScheduleModel) {
    // tslint:disable-next-line: no-string-literal
    return this._baseCanEdit(model);
  }
  private _baseCanEdit(model: CurriculumScheduleModel) {
    // tslint:disable-next-line: no-string-literal
    return !(model.id && model['editType'] !== 'info') && !(model.status && ['3', '4', '5'].includes(model.status.value));
  }
}
