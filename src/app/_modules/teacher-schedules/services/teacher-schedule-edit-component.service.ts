import {Injectable} from '@angular/core';
import {NgxExcelComponentService, NgxExcelColumnType, NgxExcelContextChanged} from 'ngx-excel';
import {TeacherService, TeacherScheduleService, TeacherSchedule, SelectOption} from '@uni/core';
import {of, throwError} from 'rxjs';
import {pascalCase} from 'change-case';
import {isUndefined} from 'util';
import {tap, mergeMap, map} from 'rxjs/operators';
import {utc} from 'moment';

@Injectable()
export class TeacherScheduleEditComponentService extends NgxExcelComponentService {

  constructor(
    private teacherScheduleService: TeacherScheduleService,
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
   * 当学员变更时执行
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleFrequencyChanged(originalModel: TeacherSchedule, model: TeacherSchedule) {
    model.startDate = '';
    model.endDate = '';
    model.week = null;
    return of([{ action: 'updated', context: model }]);
  }

  /**
   * 验证开始日期的有效性
   * @param model 模型
   * @param startDate 新值
   */
  public validateStartDate(model: TeacherSchedule, startDate: string) {
    return this._validateDate(Object.assign({}, model, { startDate }), 'startDate');
  }

  /**
   * 验证结束日期的有效性
   * @param model 模型
   * @param endDate 新值
   */
  public validateEndDate(model: TeacherSchedule, endDate: string) {
    return this._validateDate(Object.assign({}, model, { endDate }), 'endDate');
  }

  /**
   * 验证开始时间的有效性
   * @param model 模型
   * @param startTime 新值
   */
  public validateStartTime(model: TeacherSchedule, startTime: string) {
    return this._validateTime(Object.assign({}, model, { startTime }), 'startTime');
  }

  /**
   * 验证结束时间的有效性
   * @param model 模型
   * @param endTime 新值
   */
  public validateEndTime(model: TeacherSchedule, endTime: string) {
    return this._validateTime(Object.assign({}, model, { endTime }), 'endTime');
  }

  /**
   * 验证周几的有效性
   * @param model 模型
   * @param newValue 新值
   */
  public validateWeek(model: TeacherSchedule, newValue: SelectOption) {
    if (!model.frequency) {
      return '请先设置频率';
    }
    if (model.frequency.value === '3' && !newValue) {
      return '频率为每周时必须选择周几';
    }
    return true;
  }


  /**
   * 增加新的记录
   * @param model 模型
   */
  public append(model: TeacherSchedule) {
    return of(model).pipe(
      mergeMap((data) => {
        const validResult = this._validateForAppend(data);
        return typeof (validResult) === 'string' ? throwError(new Error(validResult)) : of(data);
      }),
      mergeMap((res) => {
        return this.teacherScheduleService.save(Object.assign({ teacher_ids: this._getTeacherIds(res) }, res, { schoolId: res.relativeSchool.id }));
      })
    );
  }

  /**
   * 验证日期的有效性
   * @param model 模型
   * @param modelKey 验证域
   */
  private _validateDate(model: TeacherSchedule, modelKey: string) {
    if (!model.frequency) {
      return '请先设置频率';
    }
    if (model.frequency.value === '1' && !model[modelKey]) {
      return '频率为时间段时必须输入开始日期和结束日期';
    }
    if (!model[modelKey]) {
      return true;
    }

    const dateObj = utc(model[modelKey], 'YYYY-MM-DD', true);
    if (!dateObj.isValid()) {
      return '无法识别的日期格式';
    }

    if (modelKey === 'startDate') {
      const relativeDateObj = utc(model.endDate, 'YYYY-MM-DD', true);
      if (!relativeDateObj.isValid()) {
        return true;
      }
      return dateObj.isAfter(relativeDateObj) ? '开始日期不能晚于结束日期' : true;
    } else {
      const relativeDateObj = utc(model.startDate, 'YYYY-MM-DD', true);
      if (!relativeDateObj.isValid()) {
        return true;
      }
      return dateObj.isBefore(relativeDateObj) ? '结束日期不能早于开始日期' : true;
    }
  }

  /**
   * 验证时间的有效性
   * @param model 模型
   * @param modelKey 验证域
   */
  private _validateTime(model: TeacherSchedule, modelKey: string) {
    if (!model.frequency) {
      return '请先设置频率';
    }
    if (model.frequency.value === '2' && !model[modelKey]) {
      return '频率为每天时必须输入开始时间和结束时间';
    }
    if (!model[modelKey]) {
      return true;
    }

    const timeObj = utc(model[modelKey], 'HH:mm', true);
    if (!timeObj.isValid()) {
      return '无法识别的时间格式';
    }

    if (modelKey === 'startTime') {
      const relativeTimeObj = utc(model.endTime, 'HH:mm', true);
      if (!relativeTimeObj.isValid()) {
        return true;
      }
      return timeObj.isAfter(relativeTimeObj) ? '开始时间不能晚于结束时间' : true;
    } else {
      const relativeTimeObj = utc(model.startTime, 'HH:mm', true);
      if (!relativeTimeObj.isValid()) {
        return true;
      }
      return timeObj.isBefore(relativeTimeObj) ? '结束时间不能早于开始时间' : true;
    }
  }

  /**
   * 验证新增时间安排记录的数据有效性
   * @param model 模型
   */
  private _validateForAppend(model: TeacherSchedule): boolean | string {
    const rules = this.teacherScheduleService.getRules();
    const ruleKeys = Object.keys(rules) as Array<keyof TeacherSchedule>;
    let validResult: boolean | string = true;
    ruleKeys.every((ruleKey) => {
      // 跳过主键和可选项字段的验证
      if (rules[ruleKey].columnType === NgxExcelColumnType.PrimaryKey || rules[ruleKey].optional) {
        return true;
      }
      const pascalCaseKey = pascalCase(ruleKey);
      const canMethod = `canEdit${pascalCaseKey}`;
      const validMethod = `validate${pascalCaseKey}`;
      // 如果定义了 can 方法，且当前状态下不可编辑，则无需验证
      if (!isUndefined(this[canMethod]) && !this[canMethod](model)) {
        return true;
      }
      // 当前状态是可编辑的
      if (isUndefined(this[validMethod])) {
        // 如果没有定义 valid 方法 且因 optional <> false，则要求值不可为空
        if (model[ruleKey] === '' || model[ruleKey] === null || (model[ruleKey] as any[] | string).length === 0) {
          validResult = `${rules[ruleKey].label}为必填项`;
        }
      } else {
        validResult = this[validMethod](model, model[ruleKey]);
      }

      return typeof (validResult) !== 'string';
    });
    return validResult;
  }

  private _getTeacherIds(model: TeacherSchedule): string[] {
    const list = [];
    for (const item of model.relativeTeachers) {
      list.push(item.id);
    }
    return list;
  }
}
