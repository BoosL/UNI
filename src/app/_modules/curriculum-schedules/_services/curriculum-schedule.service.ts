import {Injectable} from '@angular/core';
import {
  SelectOption,
} from '@uni/core';
import {NgxExcelColumnType} from 'ngx-excel';
import {Enums} from '../../_enums';
import {CurriculumScheduleModel} from '../models/curriculum-schedule.model';
import {BaseCurriculumScheduleService} from './base-curriculum-schedule.service';

@Injectable({providedIn: 'root'})
export class CurriculumScheduleService extends BaseCurriculumScheduleService<CurriculumScheduleModel> {

  protected resourceUri = '/campuses/{school_id}/curriculum_schedules';
  protected resourceName = 'curriculum_schedules';
  protected additionalRules = {
    isComplete: { label: '是否完整', columnType: NgxExcelColumnType.Bool, resolveValue: ((o) => this.resolveComplete(o)) },
  };
  protected resolveComplete(o: any): boolean {
    if (o.curriculum && o.teacher && o.relative_entries && o.relative_entries.length > 0) {
      return true;
    }
    return false;
  }
  // 获取默认授课方式
  public getDefaultCTypeSelectOptions(): SelectOption {
    return this.getSelectOptions(Enums.CurriculumSchedule.CType)[0];
  }

}
