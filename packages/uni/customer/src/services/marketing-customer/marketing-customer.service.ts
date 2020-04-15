import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import {
  SelectOption,
  BackendService,
  CustomerSource,
  CustomerContactType,
  Employee,
  School,
  BaseCustomerService,
  SchoolService,
  EmployeeService,
  EmployeeCcService,
  EmployeeCdService,
  EmployeeSoService,
  SchoolAvailableProductService
} from '@uni/core';
import { Enums } from '../enums';
import { MarketingCustomer } from '../../models/marketing-customer.model';
import { CustomerSourceService } from '../customer-source.service';
import { CustomerContactTypeService } from '../customer-contact-type.service';
import { of, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MarketingCustomerService extends BaseCustomerService<MarketingCustomer> {

  protected resourceUri = 'v2/customer/customers';
  protected resourceName = 'customers';
  protected scheme = 'SO';

  protected additionalRules = {
    gender: {
      label: '性别', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Common.Gender),
      prop: 'sex'
    },
    age: {
      label: '年龄', columnType: NgxExcelColumnType.Number
    },
    phone: {
      label: '联系电话', columnType: NgxExcelColumnType.TextNumber, prop: 'mobile'
    },
    phoneParents: {
      label: '父母电话', columnType: NgxExcelColumnType.TextNumber,
      prop: 'parents_mobile', optional: true
    },
    phoneBackup: {
      label: '备用电话', columnType: NgxExcelColumnType.TextNumber,
      prop: 'backup_mobile', optional: true
    },
    grade: {
      label: '年级', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getGrades(), optional: true
    },
    capacity: {
      label: '客户身份', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getCapacities()
    },
    learningPurpose: {
      label: '学习目的', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getLearningPurposes()
    },
    level: {
      label: '客户等级', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getLevels()
    },
    isImportant: {
      label: '重要客户？', columnType: NgxExcelColumnType.Bool
    },
    isEffective: {
      label: '是否有效？', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getAllEffectives()
    },
    isStudent: {
      label: '是否学员？', columnType: NgxExcelColumnType.Bool
    },
    cc: {
      label: 'CC', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeCcService as NgxExcelService<Employee>, labelKey: 'name', typeaheadKey: 'keyword',
      optional: true
    },
    levelCc: {
      label: 'CC评级', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Customer.Level),
      prop: 'cc_level', optional: true
    },
    sc: {
      label: 'SC', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService as NgxExcelService<Employee>, labelKey: 'name', typeaheadKey: 'keyword',
      optional: true
    },
    tmk: {
      label: 'TMK', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService as NgxExcelService<Employee>, labelKey: 'name', typeaheadKey: 'keyword',
      optional: true
    },
    levelTmk: {
      label: 'TMK评级', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Customer.Level),
      prop: 'tmk_level', optional: true
    },
    cd: {
      label: 'CD', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeCdService as NgxExcelService<Employee>, labelKey: 'name', typeaheadKey: 'keyword',
      optional: true
    },
    relativeFirstSource: {
      label: '一级渠道', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerSourceService as NgxExcelService<CustomerSource>, labelKey: 'name', disableCache: true,
      resolveValue: (o: any, _: Partial<MarketingCustomer>) => this.resolveRelativeFirstSource(o)
    },
    relativeSecondSource: {
      label: '二级渠道', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerSourceService as NgxExcelService<CustomerSource>, labelKey: 'name', disableCache: true,
      resolveValue: (_: any, model: Partial<MarketingCustomer>) => this.resolveRelativeSecondSource(model)
    },
    relativeThirdSource: {
      label: '点位', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerSourceService as NgxExcelService<CustomerSource>, labelKey: 'name', disableCache: true,
      resolveValue: (_: any, model: Partial<MarketingCustomer>) => this.resolveRelativeThirdSource(model)
    },
    relativeSource: {
      label: '渠道', columnType: NgxExcelColumnType.Text,
      resolveValue: (_: any, model: Partial<MarketingCustomer>) => this.resolveRelativeSource(model)
    },
    relativeSourceEmployee: {
      label: '推广专员', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeSoService as NgxExcelService<Employee>, labelKey: 'name', typeaheadKey: 'keyword',
      prop: 'source_staff'
    },
    visitedCount: {
      label: '到访次数', columnType: NgxExcelColumnType.Number,
      prop: 'visit_times', optional: true
    },
    contactType: {
      label: '来访形式', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerContactTypeService as NgxExcelService<CustomerContactType>, labelKey: 'name',
      resolveValue: (o: any, _: Partial<MarketingCustomer>) => this.resolveContactType(o)
    },
    lastVisitedSchool: {
      label: '到访校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService as NgxExcelService<School>, labelKey: 'name',
      prop: 'last_visited_campus', optional: true
    },
    lastVisitedTime: {
      label: '最近到访', columnType: NgxExcelColumnType.DateTime,
      prop: 'last_visited_at', optional: true
    },
    nextFollowBeginTime: {
      label: '预计下次跟进时间范围开始时间', columnType: NgxExcelColumnType.DateTime, prop: 'next_cc_at_start', optional: true
    },
    nextFollowEndTime: {
      label: '预计下次跟进时间范围结束时间', columnType: NgxExcelColumnType.DateTime, prop: 'next_cc_at_end', optional: true
    },
    nextFollowTime: {
      label: '下次跟进', columnType: NgxExcelColumnType.Text, optional: true,
      resolveValue: (_: any, model: Partial<MarketingCustomer>) => this.resolveNextFollowTime(model)
    },
    firstConsultingDuration: {
      label: '首咨时长', columnType: NgxExcelColumnType.Number, prop: 'first_consult_durations', optional: true
    },
    nextVisitedTime: {
      label: '预约时间', columnType: NgxExcelColumnType.Date,
      prop: 'reservation_time', optional: true
    },
    isSourceProtected: {
      label: '是否渠道保护', columnType: NgxExcelColumnType.Bool,
      prop: 'is_source_protecting', optional: true
    },
    sourceProtectedToDate: {
      label: '保护期', columnType: NgxExcelColumnType.Date,
      prop: 'source_protection_end_time', optional: true
    },
    recommendCurriculumType: {
      label: '推荐课程', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Customer.CurriculumType),
      prop: 'recommend_course_type', optional: true
    },
    recommendCurriculumCount: {
      label: '课时数', columnType: NgxExcelColumnType.Number, prop: 'recommend_course_count', optional: true
    },
    recommendCurriculumMonthCount: {
      label: '学习时长', columnType: NgxExcelColumnType.Number, prop: 'recommend_course_month', optional: true
    },
    contractRate: {
      label: '签约几率', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getContractRates(), optional: true
    },
    hasDeposit: {
      label: '订金', columnType: NgxExcelColumnType.Bool
    },
    creator: {
      label: '录入人员', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService as NgxExcelService<Employee>, labelKey: 'name', optional: true
    },
    createdTime: {
      label: '录入时间', columnType: NgxExcelColumnType.DateTime, prop: 'created_at'
    },
    status: {
      label: '当前状态', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getAllStatus()
    },
    remark: {
      label: '备注', columnType: NgxExcelColumnType.MultilineText, optional: true
    },
    remarkSource: {
      label: '渠道人员备注', columnType: NgxExcelColumnType.Text, optional: true, prop: 'source_staff_remark'
    },
    visitType: {
      label: '来访类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Customer.VisitType),
      prop: 'visit_type'
    }
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService,
    protected employeeService: EmployeeService,
    protected employeeCcService: EmployeeCcService,
    protected employeeCdService: EmployeeCdService,
    protected employeeSoService: EmployeeSoService,
    protected productService: SchoolAvailableProductService,
    protected customerSourceService: CustomerSourceService,
    protected customerContactTypeService: CustomerContactTypeService
  ) {
    super(httpClient, backendService, schoolService);
  }

  protected resolveRelativeFirstSource(o: any) {
    return o.source ? this.customerSourceService.createModel(null, o.source) : null;
  }

  protected resolveRelativeSecondSource(model: Partial<MarketingCustomer>) {
    return model.relativeFirstSource && model.relativeFirstSource.children.length > 0 ?
      model.relativeFirstSource.children[0] : null;
  }

  protected resolveRelativeThirdSource(model: Partial<MarketingCustomer>) {
    return model.relativeSecondSource && model.relativeSecondSource.children.length > 0 ?
      model.relativeSecondSource.children[0] : null;
  }

  protected resolveRelativeSource(model: Partial<MarketingCustomer>) {
    const labelParts = [];
    if (model.relativeFirstSource) {
      labelParts.push(model.relativeFirstSource.name);
    }
    if (model.relativeSecondSource) {
      labelParts.push(model.relativeSecondSource.name);
    }
    if (model.relativeThirdSource) {
      labelParts.push(model.relativeThirdSource.name);
    }
    return labelParts.join(' / ');
  }

  protected resolveContactType(o: any) {
    if (!o.contact_type) { return null; }
    const matchedContactType = this.getContactTypes().find((selectOption) => selectOption.value === o.contact_type);
    return matchedContactType ? this.customerContactTypeService.createModel({
      id: matchedContactType.value,
      name: matchedContactType.label
    }) : null;
  }

  protected resolveNextFollowTime(model: Partial<MarketingCustomer>) {
    if (!model.nextFollowBeginTime && !model.nextFollowEndTime) { return ''; }
    const beginTime = model.nextFollowBeginTime || '不限开始时间';
    const endTime = model.nextFollowEndTime || '不限结束时间';
    return `${beginTime} ~ ${endTime}`;
  }

  /**
   * 获得当前绑定的方案
   */
  public getScheme(): string {
    return this.scheme;
  }

  /**
   * 获得客户等级可选项列表
   */
  public getLevels(): SelectOption[] {
    return this.getSelectOptions(Enums.Customer.Level);
  }

  /**
   * 获得客户年级可选项列表
   */
  public getGrades(): SelectOption[] {
    return this.getSelectOptions(Enums.Customer.Grade);
  }

  /**
   * 获得客户身份可选项列表
   */
  public getCapacities(): SelectOption[] {
    return this.getSelectOptions(Enums.Customer.Capacity);
  }

  /**
   * 获得学习目的可选项列表
   */
  public getLearningPurposes(): SelectOption[] {
    return this.getSelectOptions(Enums.Customer.LearningPurpose);
  }

  /**
   * 获得来访形式的可选项列表
   */
  public getContactTypes(): SelectOption[] {
    return this.getSelectOptions(Enums.Customer.ContactType);
  }

  /**
   * 获得签约几率的可选项列表
   */
  public getContractRates(): SelectOption[] {
    return this.getSelectOptions(Enums.Customer.ContractRate);
  }

  /**
   * 获得客户状态的可选项列表
   */
  public getAllStatus(): SelectOption[] {
    return this.getSelectOptions(Enums.Customer.Status);
  }

  /**
   * 获得客户是否有效的可选项列表
   */
  public getAllEffectives(): SelectOption[] {
    return this.getSelectOptions(Enums.Customer.Effective);
  }

  /**
   * 获得年龄段的可选项列表
   */
  public getAgeFilterRange(): SelectOption[] {
    return this.getSelectOptions(Enums.Customer.AgeFilterRange);
  }


  /**
   * 动态获得可选的年级
   * @param model 当前模型
   */
  public getGradeSelectOptions(model: MarketingCustomer): Observable<SelectOption[]> {
    if (!model.capacity) { return of([]); }
    const selectOptionMap = this.getSelectOptions(Enums.Customer.GradeCapacityMap).filter(
      (selectOption) => selectOption.label === model.capacity.value
    ).map(
      (selectOption) => selectOption.value
    );
    const selectOptions = this.getGrades().filter((selectOption) => selectOptionMap.indexOf(selectOption.value) >= 0);
    return of(selectOptions);
  }


  /**
   * 客户录入时只能选择自己关联的校区
   */
  public getSchoolForeignModels() {
    const employee = this.employeeService.createModel(null, this.backendService.getCurrentUser());
    return of(employee.relativeSchools);
  }

  /**
   * 客户录入时只能选择自己绑定的来访形式
   * @param model 当前的客户模型
   */
  public getContactTypeForeignModels(model: MarketingCustomer) {
    return this.customerContactTypeService.getList({ scene: model.id ? 'o' : 'c' });
  }

  /**
   * 获得一级渠道可选项
   * @param model 待查询的模型
   */
  public getRelativeFirstSourceForeignModels(model: MarketingCustomer) {
    if (!model.school) {
      return of([]);
    }
    const filters = {
      schoolId: model.school.id,
      contactType: model.contactType.id,
      scene: model.id ? 'o' : 'c'
    };
    return this.customerSourceService.getList(filters);
  }

  /**
   * 获得二级渠道可选项
   * @param model 待查询的模型
   */
  public getRelativeSecondSourceForeignModels(model: MarketingCustomer) {
    if (!model.school || !model.relativeFirstSource) {
      return of([]);
    }
    const filters = {
      schoolId: model.school.id,
      contactType: model.contactType.id,
      scene: model.id ? 'o' : 'c',
      level: '1',
      relativeFirstSourceId: model.relativeFirstSource.id,
    };
    return this.customerSourceService.getList(filters);
  }

  /**
   * 获得点位可选项
   * @param model 待查询的模型
   */
  public getRelativeThirdSourceForeignModels(model: MarketingCustomer) {
    if (!model.school || !model.relativeFirstSource || !model.relativeSecondSource) {
      return of([]);
    }
    const filters = {
      schoolId: model.school.id,
      contactType: model.contactType.id,
      scene: model.id ? 'o' : 'c',
      level: '2',
      relativeFirstSourceId: model.relativeFirstSource.id,
      relativeSecondSourceId: model.relativeSecondSource.id
    };
    return this.customerSourceService.getList(filters);
  }

  /**
   * 获得 CC 可选项
   * @param model 待查询得模型
   * @param keyword 查询关键字
   */
  public getCcForeignModels(model: MarketingCustomer, keyword: string) {
    if (!model.school) {
      return of([]);
    }
    const filters = {
      schoolId: model.school.id,
      keyword
    };
    return this.employeeCcService.getList(filters, 1, 20);
  }

  /**
   * 获得 CD 可选项
   * @param model 待查询得模型
   * @param keyword 查询关键字
   */
  public getCdForeignModels(model: MarketingCustomer, keyword: string) {
    if (!model.school) {
      return of([]);
    }
    const filters = {
      schoolId: model.school.id,
      keyword
    };
    return this.employeeCdService.getList(filters, 1, 20);
  }

  /**
   * 获得 渠道专员 可选项
   * @param model 待查询模型
   * @param keyword 查询关键字
   */
  public getRelativeSourceEmployeeForeignModels(model: MarketingCustomer, keyword: string) {
    if (!model.school || !model.contactType || !model.relativeThirdSource) {
      return of([]);
    }
    const filters = {
      campusId: model.school.id,
      contactType: model.contactType.id,
      sourceId: model.relativeThirdSource.id,
      scene: model.id ? 'o' : 'c',
      keyword
    };
    return this.employeeSoService.getList(filters, 1, 20);
  }

}
