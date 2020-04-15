import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { BaseService, BackendService, BaseProductService } from '@uni/core';
import { CartDiscount } from '../models/cart.model';

export class CartDiscountService extends BaseService<CartDiscount> {

  protected resourceUri = 'students/{student_id}/carts/{cart_id}/discounts';
  protected resourceName = 'student_cart_discounts';
  protected rules = {
    id: {
      label: '优惠项主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    name: {
      label: '优惠名称', columnType: NgxExcelColumnType.Text
    },
    allowProductTypes: {
      label: '优惠可用产品类型', columnType: NgxExcelColumnType.MultiSelectOption,
      selectOptions: this.productService.getProductTypes(), prop: 'allow_product_type'
    },
    productType: {
      label: '优惠应用的产品类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.productService.getProductTypes()
    },
    mode: {
      label: '优惠输入方式', columnType: NgxExcelColumnType.Text
    },
    options: {
      label: '优惠可选项', columnType: NgxExcelColumnType.Array
    },
    value: {
      label: '优惠金额', columnType: NgxExcelColumnType.Currency
    },
    default: {
      label: '默认优惠金额', columnType: NgxExcelColumnType.Currency
    }
  } as NgxExcelModelColumnRules<CartDiscount>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected productService: BaseProductService<any>
  ) {
    super(httpClient, backendService);
  }

  /**
   * 获得总价的价格项主键
   */
  public getTotalItemId() {
    return '999';
  }

  /**
   * 获得分期手续费的价格项主键
   */
  public getInstalmentFeeItemId() {
    return '996';
  }

  /**
   * 获得应退金额的价格项主键
   */
  public getRefundMoneyItemId() {
    return '10';
  }

}
