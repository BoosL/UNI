import {Injectable} from '@angular/core';
import {NgxExcelComponentService} from 'ngx-excel';
import {CurriculumScheduleModel} from '../models/curriculum-schedule.model';
import {of} from 'rxjs';

@Injectable()
export class CurriculumSchedulesEditBasicComponentService extends NgxExcelComponentService {
  /**
   * 判断是否能编辑原来的用途
   * @param model 模型
   */
  public canEditProductType(model: CurriculumScheduleModel) {
    return !model.id;
  }
  public canEditProduct(model: CurriculumScheduleModel) {
    return !model.id && model.productType && model.productType.value;
  }

  public canEditSubject(model: CurriculumScheduleModel) {
    return !model.id && model.product && model.product.id;
  }

  public canEditCurriculum(model: CurriculumScheduleModel) {
    return !model.id && model.subject && model.subject.id;
  }
  public canEditTeacher(model: CurriculumScheduleModel) {
    // tslint:disable: no-string-literal
    return !(model.id && model['editType'] !== 'info') && !(model.status && ['3', '4', '5'].includes(model.status.value));
  }
  public canEditTeachingType(model: CurriculumScheduleModel) {
    return !(model.id && model['editType'] !== 'info') && !(model.status && ['3', '4', '5'].includes(model.status.value));
  }

  /**
   * 当排课类型变更时
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleProductTypeChanged(originalModel: CurriculumScheduleModel, model: CurriculumScheduleModel) {
    model.product = null;
    model.subject = null;
    model.curriculum = null;
    model.relativeEntries = [];
    return of([{ action: 'updated', context: model }]);
  }
  /**
   * 当排课产品变更时
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleProductChanged(originalModel: CurriculumScheduleModel, model: CurriculumScheduleModel) {
    model.subject = null;
    model.curriculum = null;
    model.relativeEntries = [];
    return of([{ action: 'updated', context: model }]);
  }
  /**
   * 当科目列表变更时
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleSubjectChanged(originalModel: CurriculumScheduleModel, model: CurriculumScheduleModel) {
    model.curriculum = null;
    model.relativeEntries = [];
    return of([{ action: 'updated', context: model }]);
  }
  /**
   * 当课程列表变更时
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleCurriculumChanged(originalModel: CurriculumScheduleModel, model: CurriculumScheduleModel) {
    model.relativeEntries = [];
    // model.package = model.curriculum.relativePackage;
    model.package = null;
    return of([{ action: 'updated', context: model }]);
  }
}
