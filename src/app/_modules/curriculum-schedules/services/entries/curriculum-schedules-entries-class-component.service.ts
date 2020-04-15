import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {NgxExcelComponentService} from 'ngx-excel';
import {RelativeEntity} from '../../models/curriculum-schedule.model';
import {CurriculumSchedulesEditEntriesDataService} from '../curriculum-schedules-edit-entries-data.service';

@Injectable()
export class CurriculumSchedulesEntriesClassComponentService extends NgxExcelComponentService {

  constructor(
    private editEntriesDataService: CurriculumSchedulesEditEntriesDataService,
  ) {
    super();
  }
  /**
   * 判断新增按钮是否可用
   */
  public canAddRow(model: RelativeEntity, action: string) {
    return this.editEntriesDataService.canAddRow();
  }
  public privilegeAddRow(model: RelativeEntity, action: string) {
    return this.editEntriesDataService.canAddRow();
  }
  public canEditSmallClass(model: RelativeEntity) {
    return model.relativeSchool;
  }
  /**
   * 当小班校区变更时执行
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleRelativeSchoolChanged(originalModel: RelativeEntity, model: RelativeEntity) {
    model.smallClass = null;
    this.editEntriesDataService.setRelativeEntity(model);
    return of([{ action: 'updated', context: model }]);
  }
  /**
   * 当小班变更时执行
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleSmallClassChanged(originalModel: RelativeEntity, model: RelativeEntity) {
    this.editEntriesDataService.setRelativeEntity(model);
    return of([{ action: 'updated', context: model }]);
  }
}
