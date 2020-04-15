import { Injectable } from '@angular/core';
import { NgxExcelDataService, NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { StripChinesePipe, ProductService } from '@uni/core';
import { CartRequestParam } from '../../../../models/cart.model';
import { CartService } from '../../../../services/cart.service';
import { CurriculumBlockPurchaseForm } from '../curriculum-block-purchase.model';

@Injectable()
export class CurriculumBlockPurchaseFormService extends NgxExcelDataService<CurriculumBlockPurchaseForm> {

  protected rules = {
    id: {
      label: '虚拟主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    curriculumCount: {
      label: '产品期限', columnType: NgxExcelColumnType.SelectOption, selectOptions: this.getEtpCurriculumCounts()
    },
    levelStart: {
      label: '开始级别', columnType: NgxExcelColumnType.SelectOption, selectOptions: this.getEtpLevels()
    },
    levelEnd: {
      label: '结束级别', columnType: NgxExcelColumnType.SelectOption, selectOptions: null
    },
    levelCount: {
      label: '级别数量', columnType: NgxExcelColumnType.Number
    },
    purpose: {
      label: '购买目的', columnType: NgxExcelColumnType.SelectOption, selectOptions: this.getEtpPurposes()
    }
  } as NgxExcelModelColumnRules<CurriculumBlockPurchaseForm>;

  constructor(
    protected productService: ProductService,
    protected cartService: CartService
  ) {
    super();
  }

  /**
   * 获得可选择的 Etp 期限
   */
  public getEtpCurriculumCounts() {
    return this.productService.getEtpPeriods();
  }

  /**
   * 获得默认的 Etp 期限
   */
  public getEtpFullCurriculumCount() {
    return this.getEtpCurriculumCounts().find((selectOption) => selectOption.value === '36');
  }

  /**
   * 获得可选择的 Etp 用途
   */
  public getEtpPurposes() {
    return this.productService.getEtpPurposes();
  }

  /**
   * 获得默认的 Etp 用途
   */
  public getDefaultEtpPurpose() {
    return this.getEtpPurposes().find((selectOption) => selectOption.value === '1');
  }

  /**
   * 根据学员获得可选择的 Etp 等级
   */
  public getEtpLevels() {
    const transformer = new StripChinesePipe();
    const currentStudent = this.cartService.getCurrentStudent();
    // tslint:disable-next-line: no-string-literal
    const levelEnd = currentStudent['levelEtpEnd'] ? parseInt(currentStudent['levelEtpEnd'].value, 10) : 0;
    return this.productService.getEtpLevels()
      .filter((level) => parseInt(level.value, 10) > levelEnd)
      .map((level) => ({ label: transformer.transform(level.label), value: level.value }));
  }

  /**
   * 将模型转化为购物车请求对象
   * @param model 待转化的模型
   */
  public model2RequestParam(model: CurriculumBlockPurchaseForm): CartRequestParam {
    const requestParam = Object.assign({}, model, { action: 'buy', curriculumCount: parseInt(model.curriculumCount.value, 10) });
    delete requestParam.id;
    return requestParam as CartRequestParam;
  }

}
