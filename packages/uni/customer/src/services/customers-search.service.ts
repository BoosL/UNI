import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelService, NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import {
  BackendService,
  BaseService,
  CustomerSource,
  SchoolMenuService,
  EmployeeCcService,
  Employee,
  EmployeeSoService,
  SelectOption
} from '@uni/core';
import { MarketingCustomerService } from './marketing-customer/marketing-customer.service';
import { CustomerSourceStatelessService } from './customer-source-stateless.service';
import { CustomersSearch } from '../models/customers-search.model';
import { of, Observable } from 'rxjs';
import { MarketingCustomer } from '../models/models';
import { Enums } from './enums';

@Injectable({ providedIn: 'root' })
export class CustomersSearchService extends BaseService<CustomersSearch> {

  protected resourceUri = '';
  protected resourceName = '';

  protected rules = {
    id: {
      label: '临时主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    name: {
      label: '客户姓名', columnType: NgxExcelColumnType.Text
    },
    phone: {
      label: '手机号码', columnType: NgxExcelColumnType.Text, prop: 'mobile'
    },
    createdTimeRange: {
      label: '录入时间', columnType: NgxExcelColumnType.DateRange, prop: 'last_added_at'
    },
    status: {
      label: '客户状态', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerService.getAllStatus()
    },
    isEffective: {
      label: '首次有效？', columnType: NgxExcelColumnType.Bool, prop: 'first_tmk_validity'
    },
    isImportant: {
      label: '重点客户？', columnType: NgxExcelColumnType.Bool
    },
    contactType: {
      label: '到访形式', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerService.getContactTypes()
    },
    hasDeposit: {
      label: '是否收订金？', columnType: NgxExcelColumnType.Bool
    },
    relativeFirstSource: {
      label: '一级渠道', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerSourceService as NgxExcelService<CustomerSource>, labelKey: 'name', disableCache: true
    },
    relativeSecondSource: {
      label: '二级渠道', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerSourceService as NgxExcelService<CustomerSource>, labelKey: 'name', disableCache: true
    },
    relativeThirdSource: {
      label: '点位', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerSourceService as NgxExcelService<CustomerSource>, labelKey: 'name', disableCache: true
    },
    level: {
      label: '客户等级', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerService.getLevels()
    },
    capacity: {
      label: '客户身份', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerService.getCapacities()
    },
    grade: {
      label: '年级', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerService.getGrades()
    },
    ageRange: {
      label: '年龄段', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerService.getAgeFilterRange(), prop: 'age'
    },
    learningPurpose: {
      label: '学习目的', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerService.getLearningPurposes()
    },
    relativeSourceEmployee: {
      label: '市场专员', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeSoService as NgxExcelService<Employee>, labelKey: 'name', typeaheadKey: 'keyword'
    },
    lastVisitedTimeRange: {
      label: '到访时间', columnType: NgxExcelColumnType.DateRange, prop: 'last_visited_at'
    },
    nextVisitedTimeRange: {
      label: '预约到访', columnType: NgxExcelColumnType.DateRange, prop: 'reservation_time'
    },
    cc: {
      label: 'CC专员', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeCcService as NgxExcelService<Employee>, labelKey: 'name', typeaheadKey: 'keyword'
    },
    subordinate: {
      label: '是否有下属标识', columnType: NgxExcelColumnType.Bool
    },
    contractRate: {
      label: '签约几率', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerService.getContractRates()
    },
    visitType: {
      label: '来访类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Customer.VisitType),
      prop: 'visit_type'
    }
  } as NgxExcelModelColumnRules<CustomersSearch>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolMenuService: SchoolMenuService,
    protected customerService: MarketingCustomerService,
    protected customerSourceService: CustomerSourceStatelessService,
    protected employeeCcService: EmployeeCcService,
    protected employeeSoService: EmployeeSoService
  ) {
    super(httpClient, backendService);
  }

  public getRules() {
    const rules = super.getRules();
    Object.keys(rules).forEach((ruleKey) => rules[ruleKey].optional = true);
    return rules;
  }

  /**
   * 动态获得可选的年级
   * @param model 当前模型
   */
  public getGradeSelectOptions(model: CustomersSearch): Observable<SelectOption[]> {
    return this.customerService.getGradeSelectOptions({ capacity: model.capacity } as MarketingCustomer);
  }

  /**
   * 获得一级渠道可选项
   * @param _ 待查询的模型
   */
  public getRelativeFirstSourceForeignModels(_: CustomersSearch) {
    const filters = { schoolId: '', };
    const currentSchool = this.schoolMenuService.currentSchool;
    if (currentSchool && currentSchool.id !== '-1') {
      filters.schoolId = currentSchool.id;
    }
    return this.customerSourceService.getList(filters);
  }

  /**
   * 获得二级渠道可选项
   * @param model 待查询的模型
   */
  public getRelativeSecondSourceForeignModels(model: CustomersSearch) {
    if (!model.relativeFirstSource) {
      return of([]);
    }
    const filters = {
      schoolId: '', level: '1',
      relativeFirstSourceId: model.relativeFirstSource.id
    };
    const currentSchool = this.schoolMenuService.currentSchool;
    if (currentSchool && currentSchool.id !== '-1') {
      filters.schoolId = currentSchool.id;
    }
    return this.customerSourceService.getList(filters);
  }

  /**
   * 获得点位可选项
   * @param model 待查询的模型
   */
  public getRelativeThirdSourceForeignModels(model: CustomersSearch) {
    if (!model.relativeFirstSource || !model.relativeSecondSource) {
      return of([]);
    }
    const filters = {
      schoolId: '', level: '2',
      relativeFirstSourceId: model.relativeFirstSource.id,
      relativeSecondSourceId: model.relativeSecondSource.id
    };
    const currentSchool = this.schoolMenuService.currentSchool;
    if (currentSchool && currentSchool.id !== '-1') {
      filters.schoolId = currentSchool.id;
    }
    return this.customerSourceService.getList(filters);
  }

  /**
   * 获得可选的CC列表
   * @param model 带查询的模型
   * @param keyword 查询关键字
   */
  public getCcForeignModels(model: CustomersSearch, keyword: string) {
    const currentSchool = this.schoolMenuService.currentSchool;
    if (!currentSchool || currentSchool.id === '-1') {
      return of([]);
    }
    const filters = {
      schoolId: currentSchool.id,
      keyword
    };
    if (model.subordinate) {
      // tslint:disable-next-line: no-string-literal
      filters['staff_subordinate'] = 1;
    }
    return this.employeeCcService.getList(filters, 1, 20);
  }

  /**
   * 获得过滤条件
   */
  public getConditions(model: Partial<CustomersSearch>) {
    const payload = Object.assign({}, model);
    // tslint:disable: no-string-literal
    if (payload.relativeThirdSource) {
      payload['sourceId'] = payload.relativeThirdSource.id;
    } else if (payload.relativeSecondSource) {
      payload['sourceId'] = payload.relativeSecondSource.id;
    } else if (payload.relativeFirstSource) {
      payload['sourceId'] = payload.relativeFirstSource.id;
    } else {
      payload['sourceId'] = '';
    }
    payload['sourceStaffId'] = payload.relativeSourceEmployee ? payload.relativeSourceEmployee.id : '';
    delete payload.relativeFirstSource;
    delete payload.relativeSecondSource;
    delete payload.relativeThirdSource;

    const conditions = this.resolveBody(payload);

    const dateRangeToDateTimeRange = (dateRange: string) => {
      if (!dateRange || dateRange.indexOf(',') < 0) { return ''; }
      const dateRangeParts = dateRange.split(',');
      if (dateRangeParts[0]) {
        dateRangeParts[0] += ' 00:00:00';
      }
      if (dateRangeParts[1]) {
        dateRangeParts[1] += ' 23:59:59';
      }
      return dateRangeParts.join(',');
    };

    conditions['last_added_at'] = dateRangeToDateTimeRange(conditions['last_added_at']);
    conditions['last_visited_at'] = dateRangeToDateTimeRange(conditions['last_visited_at']);
    conditions['reservation_time'] = dateRangeToDateTimeRange(conditions['reservation_time']);

    return conditions;
  }

}
