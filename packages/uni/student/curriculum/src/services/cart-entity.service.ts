import {
  SelectOption,
  Product,
  BackendService,
  BaseProductService,
  Student,
  BaseProductSubjectService,
  School,
  ProductSubject
} from '@uni/core';
import { NgxExcelColumnType } from 'ngx-excel';
import { HttpClient } from '@angular/common/http';
import { CartRequestParam, CartEntity, CartEntityTimeSectionConfig } from '../models/cart.model';
import { throwError } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

export class CartEntityService extends BaseProductSubjectService<CartEntity> {

  protected resourceUri = 'students/{student_id}/carts/{cart_id}/products';
  protected resourceName = 'subjects';
  protected additionalRules = {
    buyMode: {
      label: '操作维度', columnType: NgxExcelColumnType.SelectOption, selectOptions: this.getModes()
    },
    isRefund: {
      label: '是否退课', columnType: NgxExcelColumnType.Bool
    },
    curriculumCount: {
      label: '课时数', columnType: NgxExcelColumnType.Number, optional: true
    }
  };

  protected currentSchool: School;
  protected currentStudent: Student;
  protected currentCartType: SelectOption;
  protected availableProductTypes: SelectOption[];
  protected timeSectionConfigs: CartEntityTimeSectionConfig[];

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected productService: BaseProductService<Product>,
    protected subjectService: BaseProductSubjectService<ProductSubject>
  ) {
    super(httpClient, backendService, productService);
  }

  /**
   * 预购模式
   */
  public getModes(): SelectOption[] {
    return [
      { label: '课时模式', value: '1' },
      { label: '课号模式', value: '2' }
    ];
  }

  /**
   * 获得课时操作模式枚举
   */
  public getCurriculumCountMode(): SelectOption {
    return this.getModes().find((selectOption) => selectOption.value === '1');
  }

  /**
   * 获得课号操作模式枚举
   */
  public getCurriculumNoMode(): SelectOption {
    return this.getModes().find((selectOption) => selectOption.value === '2');
  }

  public initial(currentSchool: School, currentStudent: Student, currentCartType: SelectOption) {
    this.currentSchool = currentSchool;
    this.currentStudent = currentStudent;
    this.currentCartType = currentCartType;
    return this.getList();
  }

  /**
   * 获得可用的产品类型列表
   */
  public getAvailableProductTypes(): SelectOption[] {
    return this.availableProductTypes || [];
  }

  /**
   * 获得学习时长配置
   */
  public getTimeSectionConfigs(): CartEntityTimeSectionConfig[] {
    return this.timeSectionConfigs || [];
  }

  /**
   * @inheritdoc
   */
  public getList(filters?: { [name: string]: string | string[] }) {
    filters = Object.assign({}, filters || {}, {
      studentId: this.currentStudent.id,
      cartId: '_current',
      contractType: this.currentCartType.value,
      meta: 'product_types,study_time_sections'
    });
    return super.getList(filters).pipe(
      tap(() => {
        // tslint:disable: no-string-literal
        const availableProductTypeValues = (this.getResponseMetas()['product_types'] || [])
          .map((productTypeValue: string | number) => `${productTypeValue}`);
        this.availableProductTypes = this.productService.getProductTypes()
          .filter((productType) => availableProductTypeValues.indexOf(productType.value) >= 0);
        this.timeSectionConfigs = (this.getResponseMetas()['study_time_sections'] || []).filter(
          (o: any) => this.availableProductTypes.some((productType) => productType.value === `${o.product_type}`)
        ).map(
          (o: any) => ({ startTime: o.start_at, endTime: o.expired_at })
        );
      })
    );
  }

  /**
   * @inheritdoc
   */
  public batchUpdate(requestParam: CartRequestParam) {
    if (requestParam.action !== 'time' || (!requestParam.startTime && !requestParam.endTime)) {
      return throwError(new Error('系统错误，请联系管理员'));
    }
    // tslint:disable: no-string-literal
    const payload = {};
    payload['productType'] = requestParam.product.type.value;
    payload['startAt'] = requestParam.startTime;
    payload['expiredAt'] = requestParam.endTime;
    return super.batchUpdate(Object.assign({}, payload, {
      studentId: this.currentStudent.id, cartId: '_current', contractType: this.currentCartType.value
    })).pipe(mergeMap(() => this.getList()));
  }

  /**
   * @inheritdoc
   */
  public batchSave(requestParam: CartRequestParam) {
    const isEtpProductType = this.productService.getEtpProductTypes()
      .some((productType) => productType.value === requestParam.productType.value);
    if (requestParam.action === 'time') {
      return throwError(new Error('系统错误，请联系管理员'));
    }
    // tslint:disable: no-string-literal
    const payload = {};
    if (requestParam.action === 'refund') {
      // 根据 课时 / 课号 退
      payload['buyMode'] = requestParam.buyMode;
      payload['productId'] = requestParam.product.id;
      payload['productType'] = requestParam.productType.value;
      payload['subjectId'] = requestParam.subject.id;
      payload['isRefund'] = '1';
      if (requestParam.buyMode.value === '1') {
        payload['buyNum'] = requestParam.curriculumCount;
      } else {
        payload['curriculumIds'] = requestParam.curriculums.map((curriculum) => curriculum.id);
      }
    } else if (isEtpProductType && requestParam.levelCount) {
      // 根据 ETP 级别数量购买
      payload['buyNum'] = requestParam.curriculumCount;
      payload['productType'] = requestParam.productType.value;
      payload['levelNum'] = requestParam.levelCount;
      payload['startLevel'] = requestParam.levelStart.value;
      payload['levelEnd'] = requestParam.levelEnd.value;
      payload['usedFor'] = requestParam.purpose.value;
    } else {
      // 根据 课时 / 课号 购买
      payload['buyMode'] = requestParam.buyMode;
      payload['productId'] = requestParam.product.id;
      payload['productType'] = requestParam.productType.value;
      payload['subjectId'] = requestParam.subject.id;
      if (requestParam.buyMode.value === '1') {
        payload['buyNum'] = requestParam.curriculumCount;
      } else {
        payload['curriculumIds'] = requestParam.curriculums.map((curriculum) => curriculum.id);
      }
    }
    return super.batchSave(Object.assign({}, payload, {
      studentId: this.currentStudent.id, cartId: '_current', contractType: this.currentCartType.value
    }));
  }

}
