import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { BaseService, BackendService, SchoolService } from '@uni/core';
import { SchoolRestTime } from '../models/school.model';

@Injectable({providedIn: 'root'})
export class SchoolRestTimeService extends BaseService<SchoolRestTime> {

  protected resourceUri = 'campuses/{school_id}/rest_times';
  protected resourceName = 'rest_times';
  protected rules = {
    id: { label: '校区休息时间主键', columnType: NgxExcelColumnType.PrimaryKey },
    name: { label: '标题', columnType: NgxExcelColumnType.Text },
    startTime: { label: '开始时间', columnType: NgxExcelColumnType.Time },
    endTime: { label: '结束时间', columnType: NgxExcelColumnType.Time },
    relativeSchool: {
      label: '所属校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService, labelKey: 'name',
      prop: 'campus'
    },
    createdTime: { label: '创建时间', columnType: NgxExcelColumnType.DateTime, prop: 'created_at' }
  } as NgxExcelModelColumnRules<SchoolRestTime>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService
  ) {
    super(httpClient, backendService);
  }

}
