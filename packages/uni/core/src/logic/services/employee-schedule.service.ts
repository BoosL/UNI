import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { BaseService } from '../../services/base.service';
import { SelectOption } from '../../models/select-option.model';
import { Enums } from '../enums';
import { EmployeeSchedule } from '../models/employee-schedule.model';

@Injectable()
export class EmployeeScheduleService extends BaseService<EmployeeSchedule> {

  protected resourceUri = 'staff/{employee_id}/schedules';
  protected resourceName = 'schedules';
  protected rules = {
    id: {
      label: '主键',
      columnType: NgxExcelColumnType.PrimaryKey
    },
    date: {
      label: '日期',
      columnType: NgxExcelColumnType.Date
    },
    type: {
      label: '班表类型',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getTypes()
    },
    auditType: {
      label: '班表类型',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getTypes()
    },
    attachments: {
      label: '附件',
      columnType: NgxExcelColumnType.MultiUploadFile,
      acceptedFileSize: 800,
      acceptedFileType: ['.jpg', '.jpeg', '.png', '.bmp']
    },
    status: {
      label: '当前状态',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.EmployeeSchedule.Status)
    }
  } as NgxExcelModelColumnRules<EmployeeSchedule>;

  /**
   * 获得员工所有的班表类型
   */
  public getTypes(): SelectOption[] {
    return this.getSelectOptions(Enums.EmployeeSchedule.Type);
  }

  /**
   * 获得未确认时可用的班表类型
   */
  public getUnconfirmedScheduleTypes(): SelectOption[] {
    return this.getTypes().filter((selectOption) => ['1', '2', '3'].indexOf(selectOption.value) >= 0);
  }

  /**
   * 获得确认之后可用的班表类型
   */
  public getConfirmedScheduleTypes(): SelectOption[] {
    return this.getTypes().filter((selectOption) => ['1', '2', '3'].indexOf(selectOption.value) < 0);
  }

}
