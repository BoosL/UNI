import {Injectable} from '@angular/core';
import {NgxExcelDataService} from 'ngx-excel';
import {CurriculumScheduleModel} from '../models/curriculum-schedule.model';
import {CurriculumSchedulesStateService} from './curriculum-schedules-state.service';
import {CurriculumScheduleService} from '../_services/curriculum-schedule.service';

@Injectable()
export class CurriculumSchedulesEditDataService extends NgxExcelDataService<CurriculumScheduleModel> {

  constructor(
    protected dataService: CurriculumSchedulesStateService,
    protected curriculumScheduleService: CurriculumScheduleService,
  ) {
    super();
  }

  /**
   * @inheritdoc
   */
  public getRules() {
    return this.curriculumScheduleService.getRules();
  }

  public createModel(attributes?: Partial<CurriculumScheduleModel>, o?: any) {
    return this.curriculumScheduleService.createModel(attributes, o);
  }

  public save(data: { [name: string]: any }, primaryKey?: string) {
    return this.curriculumScheduleService.save(data, primaryKey);
  }

  /**
   * 获取默认授课方式
   */
  public getDefaultCTypeSelectOptions() {
    return this.curriculumScheduleService.getDefaultCTypeSelectOptions();
  }

  /**
   * 新增排课
   */
  public append(data: CurriculumScheduleModel) {
    const param = Object.assign({}, data, {
      schoolId: data.school.id,
      relative_entries: this._assmbleRelativeEntries(data),
    });
    return this.save(param);
  }

  public changeSchedule(data: CurriculumScheduleModel) {
    this.dataService.changeSchedule(data);
  }

  /**
   * 组装需提交的上课实体数据
   */
  private _assmbleRelativeEntries(res: CurriculumScheduleModel) {
    const data = [];
    if (res.relativeEntries && res.relativeEntries.length > 0) {
      for (const item of res.relativeEntries) {
        if (item.type && item.type.value === 'TEACHE_SCHEDULE_STUDENT' && item.student) {
          data.push({
            type: item.type.value,
            student_id: item.student.id
          });
        }
        if (item.type && item.type.value === 'TEACHE_SCHEDULE_CUSTOMER' && item.customer) {
          data.push({
            type: item.type.value,
            customer_id: item.customer.id
          });
        }
        if (item.type && item.type.value === 'SMALL_CLASS' && item.smallClass) {
          for (const student of item.smallClass.students) {
            data.push({
              type: 'TEACHE_SCHEDULE_STUDENT',
              student_id: student.id
            });
          }
        }
      }
    }
    return data;
  }

  /*
  * 判断教室是否变更*/
  public classRoomIsChanged(originModel: CurriculumScheduleModel, model: CurriculumScheduleModel) {
    return this._judgeValueIsChanged(originModel.classroom, model.classroom, 'id');
  }

  /*
  * 判断除教室外其他信息是否变更*/
  public infoIsChanged(originModel: CurriculumScheduleModel, model: CurriculumScheduleModel) {
    let isChanged = false;
    for (const key in originModel) {
        switch (key) {
          case 'meetingName':
          case 'meetingNumber':
          case 'meetingAccount':
          case 'remark':
            if (this._judgeValueIsChanged(originModel[key], model[key])) {
              isChanged = true;
            }
            break;
          case 'teacher':
            if (this._judgeValueIsChanged(originModel[key], model[key], 'id')) {
              isChanged = true;
            }
            break;
          case 'teachingType':
            if (this._judgeValueIsChanged(originModel[key], model[key], 'value')) {
              isChanged = true;
            }
            break;
        }
    }
    return isChanged;
  }

  /*
 * 判断两个对象指定key是否相同*/
  private _judgeValueIsChanged(originModel: any, model: any, key?: string) {
    return key ? (!originModel && model)
      || (originModel && !model) ||
      (originModel && model && originModel[key] !== model[key]) :  (!originModel && model)
      || (originModel && !model) ||
      (originModel && model && originModel !== model);
  }


}
