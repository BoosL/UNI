import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import { AuthService } from '@uni/common';
import { BaseService, BackendService, EmployeeService, CustomerSource, SchoolService, School } from '@uni/core';
import { TmkEmployeesSearch } from '../models/tmk-employees-search.model';
import { TmkEmployeeSourceService } from './tmk-employee-source.service';
import { of } from 'rxjs';

@Injectable()
export class TmkEmployeesSearchService extends BaseService<TmkEmployeesSearch> {

  protected resourceUri = '';
  protected resourceName = '';

  protected rules = {
    id: {
      label: '临时主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    keyword: {
      label: '关键字', columnType: NgxExcelColumnType.Text
    },
    relativeSchools: {
      label: '关联校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService as NgxExcelService<School>, labelKey: 'name', prop: 'campus'
    },
    level: {
      label: '职位等级', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.employeeService.getPositionLevels(), prop: 'position_level'
    },
    acceptCustomer: {
      label: '参与分配？', columnType: NgxExcelColumnType.Bool, prop: 'accept_assign'
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
    }
  } as NgxExcelModelColumnRules<TmkEmployeesSearch>;


  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected authService: AuthService,
    protected schoolService: SchoolService,
    protected employeeService: EmployeeService,
    protected customerSourceService: TmkEmployeeSourceService
  ) {
    super(httpClient, backendService);
  }

  /**
   * @inheritdoc
   */
  public getRules() {
    const rules = super.getRules();
    Object.keys(rules).forEach((ruleKey) => rules[ruleKey].optional = true);
    return rules;
  }

  /**
   * 获得可用的校区列表
   * @param _ 带查询的模型
   */
  public getRelativeSchoolsForeignModels(_: TmkEmployeesSearch) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }
    const employee = this.employeeService.createModel(null, currentUser);
    return of(employee.relativeSchools);
  }

  /**
   * 获得一级渠道可选项
   * @param _ 待查询的模型
   */
  public getRelativeFirstSourceForeignModels(_: TmkEmployeesSearch) {
    const filters = { employeeId: '', };
    return this.customerSourceService.getList(filters);
  }

  /**
   * 获得二级渠道可选项
   * @param model 待查询的模型
   */
  public getRelativeSecondSourceForeignModels(model: TmkEmployeesSearch) {
    if (!model.relativeFirstSource) {
      return of([]);
    }
    const filters = {
      employeeId: '', level: '1',
      relativeFirstSourceId: model.relativeFirstSource.id
    };
    return this.customerSourceService.getList(filters);
  }

  /**
   * 获得点位可选项
   * @param model 待查询的模型
   */
  public getRelativeThirdSourceForeignModels(model: TmkEmployeesSearch) {
    if (!model.relativeFirstSource || !model.relativeSecondSource) {
      return of([]);
    }
    const filters = {
      employeeId: '', level: '2',
      relativeFirstSourceId: model.relativeFirstSource.id,
      relativeSecondSourceId: model.relativeSecondSource.id
    };
    return this.customerSourceService.getList(filters);
  }

  /**
   * 获得过滤条件
   */
  public getConditions(model: Partial<TmkEmployeesSearch>) {
    const payload = Object.assign({}, model);
    // tslint:disable: no-string-literal
    if (payload.relativeThirdSource) {
      payload['source'] = payload.relativeThirdSource.id;
    } else if (payload.relativeSecondSource) {
      payload['source'] = payload.relativeSecondSource.id;
    } else if (payload.relativeFirstSource) {
      payload['source'] = payload.relativeFirstSource.id;
    } else {
      payload['source'] = '';
    }
    delete payload.relativeFirstSource;
    delete payload.relativeSecondSource;
    delete payload.relativeThirdSource;
    delete payload.id;

    const conditions = this.resolveBody(payload);
    return conditions;
  }

}
