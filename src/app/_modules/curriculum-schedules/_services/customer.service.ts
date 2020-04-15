
import {BackendService, BaseService, SchoolService} from '@uni/core';
import {BaseCustomer} from '../models/customer.model';
import {NgxExcelColumnType} from 'ngx-excel';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
@Injectable({providedIn: 'root'})
export class CustomerService extends BaseService<BaseCustomer> {
  protected resourceUri = '/campuses/{school_id}/customers';
  protected resourceName = 'customer';
  protected rules = {
    id:     { label: '客户主键', columnType: NgxExcelColumnType.PrimaryKey, prop: 'customer_id'},
    nameCn: { label: '中文名称', columnType: NgxExcelColumnType.Text, prop: 'chinese_name' },
    nameEn: { label: '英文名称', columnType: NgxExcelColumnType.Text, prop: 'english_name' },
    name:   {
      label: '客户姓名',
      columnType: NgxExcelColumnType.Text,
      resolveValue: (_: any, context: BaseCustomer) => this.resolveFullName(_, context) },
    school: {
      label: '所属校区',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService,
      labelKey: 'name',
      prop: 'campus'
    }
  }
  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService,
  ) {
    super(httpClient, backendService);
  }
  protected resolveFullName(_: any, context: BaseCustomer) {
    if (context.nameCn && context.nameEn) {
      return context.nameEn + ' (' + context.nameCn + ')';
    }
    return context.nameCn ? context.nameCn : (context.nameEn || '');
  }
}
