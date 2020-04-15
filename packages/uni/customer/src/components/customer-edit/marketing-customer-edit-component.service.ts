import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { MarketingCustomer} from '../../models/marketing-customer.model';
import { MarketingCustomerCcrnService} from '../../services/marketing-customer/marketing-customer-ccrn.service';

import { of, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class MarketingCustomerEditComponentService extends NgxExcelComponentService {

  // tslint:disable-next-line: variable-name
  private _ccrnCurrentConfigStream = new Subject<any>();

  constructor(
    protected customerCcrnService: MarketingCustomerCcrnService
  ) {
    super();
  }

  /**
   * 获得当前配置流
   */
  public get ccrnCurrentConfig$() {
    return this._ccrnCurrentConfigStream.asObservable();
  }
  /**
   * 只有新客户才允许编辑父母电话
   * @param model 当前模型
   */
  public canEditPhoneParents(model: MarketingCustomer) {
    return !model.id;
  }

  /**
   * 只有新客户才允许编辑备用电话
   * @param model 当前模型
   */
  public canEditPhoneBackup(model: MarketingCustomer) {
    return !model.id;
  }

  /**
   * 必须先选择到访形式和校区才能选择一级渠道
   * @param model 当前模型
   */
  public canEditRelativeFirstSource(model: MarketingCustomer) {
    return !!model.contactType && !!model.school;
  }

  /**
   * 必须先选择到访形式、校区和一级渠道才能选择二级渠道
   * @param model 当前模型
   */
  public canEditRelativeSecondSource(model: MarketingCustomer) {
    return !!model.contactType && !!model.school && !!model.relativeFirstSource;
  }

  /**
   * 必须先选择到访形式、校区和二级渠道才能选择点位
   * @param model 当前模型
   */
  public canEditRelativeThirdSource(model: MarketingCustomer) {
    return !!model.contactType && !!model.school && !!model.relativeFirstSource && !!model.relativeSecondSource;
  }

  /**
   * 必须先选择到访形式、校区和点位才能选择当前的渠道专员
   * @param model 当前模型
   */
  public canEditRelativeSourceEmployee(model: MarketingCustomer) {
    return !!model.contactType && !!model.school && !!model.relativeThirdSource;
  }

  /**
   * 当到访形式选择变化时执行
   * @param _ 原模型
   * @param currentModel 当前模型
   */
  public handleContactTypeChanged(_: MarketingCustomer, currentModel: MarketingCustomer) {
    currentModel.relativeFirstSource = null;
    currentModel.relativeSecondSource = null;
    currentModel.relativeThirdSource = null;
    this._ccrnCurrentConfigStream.next([]);
    return of([{ action: 'updated', context: Object.assign({}, currentModel) }]);
  }

  /**
   * 当校区选择变化时执行
   * @param _ 原模型
   * @param currentModel 当前模型
   */
  public handleSchoolChanged(_: MarketingCustomer, currentModel: MarketingCustomer) {
    currentModel.relativeFirstSource = null;
    currentModel.relativeSecondSource = null;
    currentModel.relativeThirdSource = null;
    this._ccrnCurrentConfigStream.next([]);
    return of([{ action: 'updated', context: Object.assign({}, currentModel) }]);
  }

  /**
   * 当一级渠道选择变化时执行
   * @param _ 原模型
   * @param currentModel 当前模型
   */
  public handleRelativeFirstSourceChanged(_: MarketingCustomer, currentModel: MarketingCustomer) {
    currentModel.relativeSecondSource = null;
    currentModel.relativeThirdSource = null;
    this._ccrnCurrentConfigStream.next([]);
    return of([{ action: 'updated', context: Object.assign({}, currentModel) }]);
  }

  /**
   * 当二级渠道选择变化时执行
   * @param _ 原模型
   * @param currentModel 当前模型
   */
  public handleRelativeSecondSourceChanged(_: MarketingCustomer, currentModel: MarketingCustomer) {
    currentModel.relativeThirdSource = null;
    this._ccrnCurrentConfigStream.next([]);
    return of([{ action: 'updated', context: Object.assign({}, currentModel) }]);
  }

  /**
   * 当三级渠道选择发生变化时执行
   * @param originalModel 原模型
   * @param currentModel 当前模型
   */
  public handleRelativeThirdSourceChanged(originalModel: MarketingCustomer, currentModel: MarketingCustomer) {
    const params = {
      source_id: currentModel.relativeThirdSource.id,
      contact_type: originalModel.contactType.id,
      campus_id: originalModel.school.id,
      scene: currentModel.id ? 'o' : 'c'
    };
    return this.customerCcrnService.getList(params).pipe(
      tap((ccrn) => this._ccrnCurrentConfigStream.next(ccrn)),
      map(() => [{ action: 'updated', context: Object.assign({}, currentModel) }])
    );
  }

}
