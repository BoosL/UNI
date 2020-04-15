import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelColumnType } from 'ngx-excel';
import { Enums } from '../../_enums';
import {BaseService, BackendService, TeacherService, SchoolMenuService, Employee} from '@uni/core';
import {AutoCourses} from '../models/auto-courses';

@Injectable({ providedIn: 'root' })
export class CurriculumSchedulesAutoCoursesService extends BaseService<AutoCourses> {

  protected resourceUri = '/courses';
  protected resourceName = '';

  protected rules = {
    id: {
      label: '键值', columnType: NgxExcelColumnType.ForeignKey
    },
    type: {
      label: '排课类型',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CurriculumSchedule.ProductType),
    },
    scheduleTime: {
      label: '排课时间',
      columnType: NgxExcelColumnType.Date,
    },
    scheduleWeek: {
      label: '排课周数',
      columnType: NgxExcelColumnType.TextNumber,
    },
    remark: {
      label: '备注',
      columnType: NgxExcelColumnType.MultilineText,
    },
  };
  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolMenuService: SchoolMenuService
  ) {
    super(httpClient, backendService);
  }
  public addAutoCourses(context: AutoCourses) {
    const conditions = Object.assign({}, context);
    // tslint:disable: no-string-literal
    conditions['school_id'] = this.schoolMenuService.currentSchool.id;
    conditions['start_time'] = conditions.scheduleTime;
    if (conditions.scheduleWeek) {
      conditions['cycle'] = conditions.scheduleWeek;
    }
    delete conditions.scheduleWeek;
    delete conditions.scheduleTime;
    return this.save(conditions);
  }
  public getAutoTypes() {
    const selectOptionValues = ['1', '2'];
    return this.getSelectOptions(Enums.CurriculumSchedule.AutoType)
    .filter((selectOption) => selectOptionValues.indexOf(selectOption.value) >= 0);
  }
  public getVipAutoTypes() {
    const selectOptionValues = ['1'];
    return this.getAutoTypes().filter((selectOption) => selectOptionValues.indexOf(selectOption.value) >= 0);
  }
  public getEtpAutoTypes() {
    const selectOptionValues = ['2'];
    return this.getAutoTypes().filter((selectOption) => selectOptionValues.indexOf(selectOption.value) >= 0);
  }
}
