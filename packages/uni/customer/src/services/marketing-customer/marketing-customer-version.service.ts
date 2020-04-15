import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService} from 'ngx-excel';
import {
  BaseService,
  BackendService,
  CustomerSource,
  CustomerContactType,
  Employee,
  EmployeeService,
  EmployeeCcService,
  SchoolService,
  School
} from '@uni/core';
import {MarketingCustomerVersion, MarketingCustomer} from '../../models/marketing-customer.model';
import {CustomerSourceService} from '../customer-source.service';
import {CustomerContactTypeService} from '../customer-contact-type.service';
import {MarketingCustomerService} from './marketing-customer.service';

@Injectable({ providedIn: 'root' })
export class MarketingCustomerVersionService extends BaseService<MarketingCustomerVersion> {

  protected resourceUri = 'v2/customer/customers/{customer_id}/info_versions';
  protected resourceName = 'customer_info_versions';

  protected rules = {
    id: { label: '主键', columnType: NgxExcelColumnType.PrimaryKey },
    grade: {
      label: '年级', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerService.getGrades(), optional: true
    },
    capacity: {
      label: '客户身份', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerService.getCapacities(), optional: true
    },
    learningPurpose: {
      label: '学习目的', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerService.getLearningPurposes(), optional: true
    },
    cc: {
      label: 'CC', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeCcService as NgxExcelService<Employee>, labelKey: 'name',
      prop: 'staffCc', optional: true
    },
    tmk: {
      label: 'TMK', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService as NgxExcelService<Employee>, labelKey: 'name',
      prop: 'staffTmk', optional: true
    },
    relativeFirstSource: {
      label: '一级渠道', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerSourceService as NgxExcelService<CustomerSource>, labelKey: 'name',
      prop: 'source', optional: true
    },
    relativeSecondSource: {
      label: '二级渠道', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerSourceService as NgxExcelService<CustomerSource>, labelKey: 'name',
      resolveValue: (_: any, model: Partial<MarketingCustomer>) => this.resolveRelativeSecondSource(model),
      optional: true
    },
    relativeThirdSource: {
      label: '点位', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerSourceService as NgxExcelService<CustomerSource>, labelKey: 'name',
      resolveValue: (_: any, model: Partial<MarketingCustomer>) => this.resolveRelativeThirdSource(model),
      optional: true
    },
    relativeSourceEmployee: {
      label: '推广专员', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService as NgxExcelService<Employee>, labelKey: 'name',
      prop: 'staffSource', optional: true
    },
    contactType: {
      label: '来访形式', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerService.getContactTypes(), optional: true
    },
    relativeMarketingCustomer: {
      label: '关联的市场客户', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerService as NgxExcelService<MarketingCustomer>, labelKey: 'name',
      resolveValue: (o: any, _: Partial<MarketingCustomerVersion>) => this.resolveRelativeMarketingCustomer(o)
    },
    creator: {
      label: '变更人', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService as NgxExcelService<Employee>, labelKey: 'name',
      prop: 'staff'
    },
    createdTime: { label: '变更时间', columnType: NgxExcelColumnType.DateTime, prop: 'created_at' },
    campus: {
      label: '所属校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService as NgxExcelService<School>, labelKey: 'name',
      prop: 'campus'
    }

  } as NgxExcelModelColumnRules<MarketingCustomerVersion>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected employeeService: EmployeeService,
    protected employeeCcService: EmployeeCcService,
    protected customerService: MarketingCustomerService,
    protected customerSourceService: CustomerSourceService,
    protected customerContactTypeService: CustomerContactTypeService,
    protected schoolService: SchoolService
  ) {
    super(httpClient, backendService);
  }

  protected resolveRelativeSecondSource(model: Partial<MarketingCustomer>) {
    return model.relativeFirstSource && model.relativeFirstSource.children.length > 0 ?
      model.relativeFirstSource.children[0] : null;
  }

  protected resolveRelativeThirdSource(model: Partial<MarketingCustomer>) {
    return model.relativeSecondSource && model.relativeSecondSource.children.length > 0 ?
      model.relativeSecondSource.children[0] : null;
  }

  protected resolveRelativeMarketingCustomer(o: any) {
    return this.customerService.createModel(null, { id: o.customer_id });
  }

}
