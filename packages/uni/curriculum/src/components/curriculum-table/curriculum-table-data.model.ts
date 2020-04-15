import { TemplateRef } from '@angular/core';
import { NgxExcelColumnTemplateContext } from 'ngx-excel';
import { ProductSubject, Product } from '@uni/core';

export interface CurriculumTableRow extends ProductSubject {
  isEtpProductType: boolean;
  selectedProduct: Product;
  selectedSubject: ProductSubject;
}

export interface CurriculumTableColumn {
  name?: string;
  label?: string;
  width?: number | string;
  template?: TemplateRef<NgxExcelColumnTemplateContext>;
}
