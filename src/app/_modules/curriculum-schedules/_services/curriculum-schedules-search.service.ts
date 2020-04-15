import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelColumnType } from 'ngx-excel';
import {map} from 'rxjs/operators';
import { Enums } from '../../_enums';
import {BaseService, BackendService, TeacherService, SchoolMenuService, Employee} from '@uni/core';
import {CurriculumSchedulesSearch} from '../models/curriculum-schedules-search.model';

@Injectable({ providedIn: 'root' })
export class CurriculumSchedulesSearchService extends BaseService<CurriculumSchedulesSearch> {

  protected resourceUri = '';
  protected resourceName = '';

  protected rules = {
    productType: {
      label: '课程类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CurriculumSchedule.ProductType), optional: true
    },
    teacher: {
      label: '授课教师',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.teacherService,
      labelKey: 'name',
      typeaheadKey: 'keyword',
      optional: true
    },
  };
  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected teacherService: TeacherService,
    protected schoolMenuService: SchoolMenuService
  ) {
    super(httpClient, backendService);
  }
  /**
   * 获取校区老师列表
   * @param model 模型
   * @param keyword 关键字
   */
  public getTeacherForeignModels(model: CurriculumSchedulesSearch, keyword?: string) {
    const param = {
      school_id: this.schoolMenuService.currentSchool.id,
      meta: 'total',
    };
    if (keyword) {
      // tslint:disable: no-string-literal
      param['keyword'] = keyword;
    }
    return this.teacherService.getList(param, 1, 20);
  }
  public getConditions(model: CurriculumSchedulesSearch) {
    const conditions = this.resolveBody(model);
 /*   if (model.teacher) {
      conditions['teacherId'] = model.teacher.id;
    }
    if (model.productType) {
      conditions['productType'] = model.productType.value;
    }
*/
    return conditions;
  }


}
