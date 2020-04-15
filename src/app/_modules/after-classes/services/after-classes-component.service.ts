import { Injectable} from '@angular/core';
import {NgxExcelComponentService} from 'ngx-excel';
import {map} from 'rxjs/operators';
import {AfterClassesService} from '../_services/after-classes.service';
import {AfterClassModel} from '../model/after-class.model';
import {of} from 'rxjs';

@Injectable()
export class AfterClassesComponentService extends NgxExcelComponentService {
  public autoCommitKeys = [
   'task', 'status', 'correctionOpinion',
  ];
  constructor(
    private afterClassesService: AfterClassesService
  ) {
    super();
  }
  /**
   * 当标准型发生变更时执行
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleCorrectionOpinionChanged(originalModel: AfterClassModel, model: AfterClassModel) {
    return this.afterClassesService.save(model, originalModel.id).pipe(
      map((res) => [{ action: 'updated', context: model }])
    );
  }
  /**
   * 当标准型发生变更时执行
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleStatusChanged(originalModel: AfterClassModel, model: AfterClassModel) {
    return this.afterClassesService.save(model, originalModel.id).pipe(
      map((res) => [{ action: 'updated', context: model }])
    );
  }
  /**
   * 当标准型发生变更时执行
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleTaskChanged(originalModel: AfterClassModel, model: AfterClassModel) {
    return this.afterClassesService.save(model, originalModel.id).pipe(
      map((res) => [{ action: 'updated', context: model }])
    );
  }
  /**
   * 删除行
   * @param model 待删除的模型
   */
  public remove(model: AfterClassModel) {
    return this.afterClassesService.destroy(model).pipe(
      map((removedModel) => [{ action: 'removed', context: removedModel }])
    );
  }
}
