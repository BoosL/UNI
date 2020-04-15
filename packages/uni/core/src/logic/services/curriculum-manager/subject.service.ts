import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import { BaseService } from '../../../services/base.service';
import { ProductSubject } from '../../models/curriculum-manager.model';
import { BackendService } from '../../../services/backend.service';
import { ProductService, BaseProductService } from './product.service';

export abstract class BaseProductSubjectService<T extends ProductSubject> extends BaseService<T> {

  protected rules = {
    id: {
      label: '科目主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    name: {
      label: '科目名称', columnType: NgxExcelColumnType.Text
    },
    curriculumCount: {
      label: '课时数量', columnType: NgxExcelColumnType.Number
    },
    description: {
      label: '科目描述', columnType: NgxExcelColumnType.MultilineText, optional: true
    },
    relativeProduct: {
      label: '关联的产品', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.productService as NgxExcelService<T['relativeProduct']>, labelKey: 'name', typeaheadKey: 'keyword',
      prop: 'product'
    }
  } as NgxExcelModelColumnRules<T>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected productService: BaseProductService<T['relativeProduct']>
  ) {
    super(httpClient, backendService);
  }

}

@Injectable()
export class ProductSubjectService extends BaseProductSubjectService<ProductSubject> {

  protected resourceUri = 'products/{product_id}/subjects';
  protected resourceName = 'subjects';

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected productService: ProductService
  ) {
    super(httpClient, backendService, productService);
  }

}
