import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {NgxExcelComponentService} from 'ngx-excel';
import {RelativeEntity} from '../../models/curriculum-schedule.model';
import {CurriculumSchedulesEditEntriesDataService} from '../curriculum-schedules-edit-entries-data.service';

@Injectable()
export class CurriculumSchedulesEntriesCustomerComponentService extends NgxExcelComponentService {

  constructor(
    private editEntriesDataService: CurriculumSchedulesEditEntriesDataService,
  ) {
    super();
  }
  /**
   * 判断删除按钮是否可用
   */
  public canRemove(model: RelativeEntity, action: string) {
    return this._statusAble(model);
  }

  public privilegeRemove(model: RelativeEntity, action: string) {
    return this._statusAble(model);
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

  private _statusAble(model) {
    // 审核中，已签课不能删除
    // tslint:disable-next-line: no-string-literal
    return !(model['scheduleStatus'] && ['3', '4', '5'].includes(model['scheduleStatus']));
  }
  public canEditRelativeSchool(model: RelativeEntity) {
    // tslint:disable-next-line: no-string-literal
    return !(model['scheduleStatus'] && ['3', '4', '5'].includes(model['scheduleStatus']))  && this.editEntriesDataService.judgeDetailInfo();
  }
  public canEditCustomer(model: RelativeEntity) {
    // tslint:disable-next-line: no-string-literal
    return !(model['scheduleStatus'] && ['3', '4', '5'].includes(model['scheduleStatus']))  && this.editEntriesDataService.judgeDetailInfo();
  }
  /**
   * 当客户校区变更时执行
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleRelativeSchoolChanged(originalModel: RelativeEntity, model: RelativeEntity) {
    model.customer = null;
    this.editEntriesDataService.setRelativeEntity(model);
    return of([{ action: 'updated', context: model }]);
  }
  /**
   * 当客户变更时执行
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleCustomerChanged(originalModel: RelativeEntity, model: RelativeEntity) {
    this.editEntriesDataService.setRelativeEntity(model);
    return of([{ action: 'updated', context: model }]);
  }
}
