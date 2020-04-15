import {Injectable} from '@angular/core';
import {
  BaseService,
  CustomerContactType
} from '@uni/core';
import {NgxExcelModelColumnRules, NgxExcelColumnType} from 'ngx-excel';

@Injectable({ providedIn: 'root' })
export class CustomerContactTypeService extends BaseService<CustomerContactType> {

  protected resourceUri = 'v2/customer/staff/_current/ccrn/contact_types';
  protected resourceName = 'contact_types';

  protected rules = {
    id: { label: '主键', columnType: NgxExcelColumnType.PrimaryKey },
    name: { label: '来访形式', columnType: NgxExcelColumnType.Text }
  } as NgxExcelModelColumnRules<CustomerContactType>;

}
