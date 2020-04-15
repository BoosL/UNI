import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import { BaseService } from '../../../services/base.service';
import { BackendService } from '../../../services/backend.service';
import { ProductCurriculum } from '../../models/curriculum-manager.model';
import { ProductService, BaseProductService } from './product.service';
import { ProductSubjectService, BaseProductSubjectService } from './subject.service';
import { CurriculumPackageService } from '../curriculum-package.service';

export abstract class BaseProductCurriculumService<T extends ProductCurriculum> extends BaseService<T> {

  protected rules = {
    id: {
      label: '课程主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    name: {
      label: '课程名称', columnType: NgxExcelColumnType.Text
    },
    price: {
      label: '建议参考价', columnType: NgxExcelColumnType.Currency
    },
    rank: {
      label: '建议上课顺序', columnType: NgxExcelColumnType.Number
    },
    description: {
      label: '课程描述', columnType: NgxExcelColumnType.MultilineText,
      optional: true
    },
    remark: {
      label: '备注', columnType: NgxExcelColumnType.MultilineText,
      optional: true
    },
    /* relativePackage: {
      label: '绑定课件包', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.curriculumPackageService, labelKey: 'name', typeaheadKey: 'keyword',
      prop: 'package',
      optional: true
    }, */
    relativeSubject: {
      label: '所属科目', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.subjectService as NgxExcelService<T['relativeSubject']>, labelKey: 'name', typeaheadKey: 'keyword',
      prop: 'subject'
    },
    relativeProduct: {
      label: '所属产品', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.productService as NgxExcelService<T['relativeProduct']>, labelKey: 'name', typeaheadKey: 'keyword',
      prop: 'product'
    }
  } as NgxExcelModelColumnRules<T>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected productService: BaseProductService<T['relativeProduct']>,
    protected subjectService: BaseProductSubjectService<T['relativeSubject']>
    /*,
    protected curriculumPackageService: CurriculumPackageService
    */
  ) {
    super(httpClient, backendService);
  }
}

@Injectable()
export class ProductCurriculumService extends BaseProductCurriculumService<ProductCurriculum> {

  protected resourceUri = 'products/{product_id}/subjects/{subject_id}/curriculums';
  protected resourceName = 'curriculums';

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected productService: ProductService,
    protected subjectService: ProductSubjectService
    /*,
    protected curriculumPackageService: CurriculumPackageService
    */
  ) {
    super(httpClient, backendService, productService, subjectService);
  }

}
