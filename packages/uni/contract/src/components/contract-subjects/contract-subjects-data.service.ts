import {Injectable} from '@angular/core';
import {
  ProductSubject,
  ProductSubjectService
} from '@uni/core';
import {NgxExcelDataService} from 'ngx-excel';

@Injectable()
export class ContractSubjectsDataService extends NgxExcelDataService<ProductSubject> {
  constructor(
    protected productSubjectService: ProductSubjectService,
  ) {
    super();
  }

  /**
   * @inheritdoc
   */
  public getRules() {
    return this.productSubjectService.getRules();
  }

}
