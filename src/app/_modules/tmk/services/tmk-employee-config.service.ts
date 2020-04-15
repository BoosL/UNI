import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import { BaseEmployeeService, BackendService, EmployeeService, CustomerSource, SchoolService, School } from '@uni/core';
import { TmkEmployeeConfig } from '../models/tmk-employee.model';
import { TmkEmployeeSourceService } from './tmk-employee-source.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TmkEmployeeConfigService extends BaseEmployeeService<TmkEmployeeConfig> {

  protected resourceUri = 'v2/tmk/configs';
  protected resourceName = 'configs';

  protected additionalRules = {
    relativeSchools: {
      label: '关联校区', columnType: NgxExcelColumnType.MultiForeignKey,
      relativeService: this.schoolService as NgxExcelService<School>, labelKey: 'name', prop: 'campus'
    },
    level: {
      label: '职称等级', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.employeeService.getPositionLevels(), prop: 'position_level'
    },
    accept: {
      label: '参与分配？', columnType: NgxExcelColumnType.Bool, prop: 'accept_assign'
    },
    relativeSources: {
      label: 'TMK渠道标签', columnType: NgxExcelColumnType.MultiForeignKey,
      relativeService: this.employeeSourceService as NgxExcelService<CustomerSource>, labelKey: 'name',
      prop: 'sources'
    }
  } as NgxExcelModelColumnRules<TmkEmployeeConfig>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService,
    protected employeeService: EmployeeService,
    protected employeeSourceService: TmkEmployeeSourceService
  ) {
    super(httpClient, backendService);
  }

  /**
   * 获得员工可用的客户渠道标签
   * @param model 当前模型
   * @param keyword 搜索关键字
   */
  public getAvailableSourcesForeignModels(model: TmkEmployeeConfig, keyword?: string): Observable<CustomerSource[]> {
    return (model.id ? this.employeeSourceService.getList({ employeeId: model.id }) : of([])).pipe(
      map((sources) => {
        const availableSources: CustomerSource[] = [];
        if (keyword) {
          availableSources.push(...this._filterAvailableSources(
            sources, (source: CustomerSource) => source.name.indexOf(keyword) >= 0, true
          ));
        } else {
          availableSources.push(...sources.map((source) => this._rebuildAvailableSource(source)));
        }
        return availableSources;
      })
    );
  }

  /**
   * 获得父标签主键对应的所有子标签
   * @param model 当前模型
   * @param parentId 父标签主键
   */
  public getAvailableSourcesForeignModelsByParentId(model: TmkEmployeeConfig, parentId: string): Observable<CustomerSource[]> {
    return (model.id ? this.employeeSourceService.getList({ employeeId: model.id }) : of([])).pipe(
      map((sources) => {
        const matchedAvailableSources = this._filterAvailableSources(sources, (source: CustomerSource) => source.id === parentId);
        if (matchedAvailableSources.length === 0) {
          return [];
        }
        return matchedAvailableSources[0].children;
      })
    );
  }

  /**
   * 重构可用渠道标签
   * @param source 原渠道标签
   * @param includeChildren 是否重构子节点
   */
  private _rebuildAvailableSource(source: CustomerSource, includeChildren?: boolean) {
    const availableSource = { id: source.id, name: source.name, children: null } as CustomerSource;
    if (source.children.length > 0) {
      availableSource.children = includeChildren ?
        source.children.map((child) => this._rebuildAvailableSource(child, includeChildren)) : [];
    }
    return availableSource;
  }

  /**
   * 自定义过滤可用渠道标签
   * @param availableSources 待过滤的可用渠道标签
   * @param callback 自定义过滤函数
   * @param includeParent 是否包括父节点
   */
  private _filterAvailableSources(
    availableSources: CustomerSource[], callback: (source: CustomerSource) => boolean, includeParent?: boolean
  ): CustomerSource[] {
    const matchedAvailableSources = [];
    availableSources.forEach((availableSource) => {
      const result = callback(availableSource);
      if (result) {
        const source = this._rebuildAvailableSource(availableSource);
        if (includeParent && availableSource.children.length > 0) {
          const resultSet = this._filterAvailableSources(availableSource.children, callback, includeParent);
          source.children = resultSet;
        } else {
          source.children = availableSource.children.length > 0 ?
            availableSource.children.map((child) => this._rebuildAvailableSource(child)) : null;
        }
        matchedAvailableSources.push(source);
      } else {
        if (availableSource.children.length > 0) {
          const resultSet = this._filterAvailableSources(availableSource.children, callback, includeParent);
          if (includeParent && resultSet.length > 0) {
            const source = this._rebuildAvailableSource(availableSource);
            source.children = resultSet;
            matchedAvailableSources.push(source);
          } else {
            matchedAvailableSources.push(...resultSet);
          }
        }
      }
    });
    return matchedAvailableSources;
  }

}
