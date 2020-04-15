import { Injectable } from '@angular/core';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { BaseClassroom, Classroom } from '../models/classroom.model';
import { BaseService } from '../../services/base.service';
import { Enums } from '../enums';
import { HttpClient } from '@angular/common/http';
import { BackendService } from '../../services/backend.service';
import { SchoolService } from './school.service';

export abstract class BaseClassroomService<T extends BaseClassroom> extends BaseService<T> {

  protected rules = {
    id: { label: '教室主键', columnType: NgxExcelColumnType.PrimaryKey },
    name: { label: '教室名称', columnType: NgxExcelColumnType.Text },
  } as NgxExcelModelColumnRules<T>;

}

@Injectable()
export class ClassroomService extends BaseClassroomService<Classroom> {

  protected resourceUri = 'campuses/{school_id}/classrooms';
  protected resourceName = 'classrooms';
  protected additionalRules = {
    frequencyName: { label: '频道名称', columnType: NgxExcelColumnType.Text },
    capacityNum: { label: '容纳人数', columnType: NgxExcelColumnType.Number },
    roomSizeType: {
      label: '教室大小', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Classroom.SizeType)
    },
    isSupportVideo: { label: '是否支持视频', columnType: NgxExcelColumnType.Bool },
    isStandard: { label: '是否标准教室', columnType: NgxExcelColumnType.Bool },
    originalPurpose: { label: '原来的用途', columnType: NgxExcelColumnType.Text, optional: true },
    status: {
      label: '当前状态', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Classroom.Status)
    },
    relativeSchool: {
      label: '所属校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService, labelKey: 'name',
      prop: 'campus'
    },
    remark: { label: '备注', columnType: NgxExcelColumnType.MultilineText, optional: true }
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService
  ) {
    super(httpClient, backendService);
  }

}
