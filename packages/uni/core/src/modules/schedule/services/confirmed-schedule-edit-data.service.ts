import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { BaseService } from '../../../services/base.service';
import { BackendService } from '../../../services/backend.service';
import { EmployeeScheduleService } from '../../../logic/logic';
import { ConfirmedScheduleEditModel } from '../models/confirmed-schedule-edit.model';
import { AvailableRestDateService } from './available-rest-date.service';

@Injectable()
export class ConfirmedScheduleEditDataService extends BaseService<ConfirmedScheduleEditModel> {

  protected resourceUri = '';
  protected resourceName = '';
  protected rules = {
    id: { label: '临时主键', columnType: NgxExcelColumnType.PrimaryKey },
    originalDate: { label: '日期', columnType: NgxExcelColumnType.Date },
    originalScheduleType: {
      label: '原班表类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.employeeScheduleService.getTypes()
    },
    startDate: { label: '开始时间', columnType: NgxExcelColumnType.Date },
    endDate: { label: '结束时间', columnType: NgxExcelColumnType.Date },
    scheduleType: {
      label: '班表变更为', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.employeeScheduleService.getConfirmedScheduleTypes()
    },
    restDates: {
      label: '用哪天调休', columnType: NgxExcelColumnType.MultiForeignKey,
      relativeService: this.availableRestDateService, labelKey: 'date'
    },
    attachments: {
      label: '上传附件', columnType: NgxExcelColumnType.MultiUploadFile,
      acceptedFileSize: 800, acceptedFileType: '.jpg,.jpeg,.png,.bmp'
    },
    remark: { label: '备注', columnType: NgxExcelColumnType.MultilineText, optional: true }
  } as NgxExcelModelColumnRules<ConfirmedScheduleEditModel>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected employeeScheduleService: EmployeeScheduleService,
    protected availableRestDateService: AvailableRestDateService
  ) {
    super(httpClient, backendService);
  }

  public getRestDatesForeignModels(model: ConfirmedScheduleEditModel) {
    return this.availableRestDateService.getList({ employeeId: '_current' });
  }

}
