import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { Enums } from '../enums';
import { TeacherSchedule } from '../models/teacher-schedule.model';
import { BaseService } from '../../services/base.service';
import { BackendService } from '../../services/backend.service';
import { SchoolService } from './school.service';
import { TeacherService } from './employee/employee';

@Injectable()
export class TeacherScheduleService extends BaseService<TeacherSchedule> {

  protected resourceUri = '/campuses/{school_id}/teacher_schedules';
  protected resourceName = 'teacher_schedules';
  protected rules = {
    id: { label: '老师时间管理主键', columnType: NgxExcelColumnType.PrimaryKey },
    relativeTeachers: {
      label: '关联的老师', columnType: NgxExcelColumnType.MultiForeignKey,
      relativeService: this.teacherService, labelKey: 'name', typeaheadKey: 'keyword',
      prop: 'teachers'
    },
    relativeSchool: {
      label: '关联的校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService, labelKey: 'name',
      prop: 'campus'
    },
    type: {
      label: '类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.TeacherSchedule.Type)
    },
    frequency: {
      label: '频率', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.TeacherSchedule.Frequency)
    },
    week: {
      label: '周几', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Common.Week)
    },
    startDate: { label: '开始日期', columnType: NgxExcelColumnType.Date },
    endDate: { label: '结束日期', columnType: NgxExcelColumnType.Date },
    startTime: { label: '开始时间', columnType: NgxExcelColumnType.Time },
    endTime: { label: '结束时间', columnType: NgxExcelColumnType.Time },
    createdTime: {
      label: '创建日期', columnType: NgxExcelColumnType.DateTime,
      prop: 'created_at',
      optional: true
    },
    remark: {
      label: '原因', columnType: NgxExcelColumnType.MultilineText,
      optional: true
    },
  } as NgxExcelModelColumnRules<TeacherSchedule>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService,
    protected teacherService: TeacherService
  ) {
    super(httpClient, backendService);
  }

  /**
   * 获得关联的老师可选项列表
   * @param model 模型
   * @param keyword 查询关键字
   */
  public getRelativeTeachersForeignModels(model: TeacherSchedule, keyword?: string) {
    const filters: { schoolId: string, keyword?: string } = { schoolId: model.relativeSchool.id };
    if (keyword) {
      filters.keyword = keyword || '';
    }
    return this.teacherService.getList(filters, 1, 20);
  }

}
