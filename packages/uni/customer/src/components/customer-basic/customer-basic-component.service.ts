import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { MarketingCustomer } from '../../models/marketing-customer.model';
import { MarketingCustomerService } from '../../services/marketing-customer/marketing-customer.service';
import { BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class CustomerBasicComponentService extends NgxExcelComponentService {

  // tslint:disable: variable-name
  private _canEditGrade = false;
  private _canEditGradeStream = new BehaviorSubject<boolean>(this._canEditGrade);

  constructor(
    protected customerService: MarketingCustomerService
  ) {
    super();
  }

  public canEditGrade(_: MarketingCustomer) {
    return this._canEditGrade;
  }

  /**
   * 获得当前是否可用年级字段的流
   */
  public get canEditGrade$() {
    return this._canEditGradeStream.asObservable();
  }

  /**
   * 当身份发生变化时执行
   * @param _ 原模型
   * @param currentModel 当前模型
   */
  public handleCapacityChange(_: MarketingCustomer, currentModel: MarketingCustomer) {
    return this.customerService.getGradeSelectOptions(currentModel).pipe(
      tap((selectOptions) => this._canEditGradeStream.next(this._canEditGrade = selectOptions.length > 0)),
      map(() => [{ action: 'updated', context: Object.assign({}, currentModel, { grade: null }) }])
    );
  }

  /**
   * 初始化组件服务
   */
  public initial(model: MarketingCustomer) {
    this.handleCapacityChange(null, model).subscribe(() => {});
  }

}
