import { Injectable } from '@angular/core';
import { NgxExcelDataService, NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import { ProductSubject, Product, ProductService } from '@uni/core';
import { CurriculumTableRow } from './curriculum-table-data.model';

@Injectable()
export abstract class CurriculumTableDataService extends NgxExcelDataService<CurriculumTableRow> {

  protected rules = {
    isEtpProductType: {
      label: '是否 ETP 类产品', columnType: NgxExcelColumnType.Bool
    },
    selectedProduct: {
      label: '选择产品', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.productService, labelKey: 'name'
    },
    selectedSubject: {
      label: '选择科目', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.subjectService, labelKey: 'name'
    }
  } as NgxExcelModelColumnRules<CurriculumTableRow>;

  constructor(
    protected productService: NgxExcelService<Product>,
    protected subjectService: NgxExcelService<ProductSubject>
  ) {
    super();
  }

  public getRules() {
    return Object.assign({}, super.getRules(), this.subjectService.getRules());
  }

  public createModelFromProductSubject(productSubject: ProductSubject): CurriculumTableRow {
    const productTypes = (this.productService as ProductService).getEtpProductTypes();
    return Object.assign(productSubject, {
      isEtpProductType: productTypes.some((productType) => productType.value === productSubject.relativeProduct.type.value),
      selectedProduct: productSubject.relativeProduct,
      selectedSubject: { id: productSubject.id, name: productSubject.name, relativeProduct: productSubject.relativeProduct }
    }) as CurriculumTableRow;
  }

}
