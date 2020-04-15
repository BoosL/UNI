import { Injectable } from '@angular/core';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { BaseService } from '../../../services/base.service';
import { AvailableRestDate } from '../models/available-rest-date.model';

@Injectable()
export class AvailableRestDateService extends BaseService<AvailableRestDate> {

  protected resourceUri = 'staff/{employee_id}/available_break_off';
  protected resourceName = 'available_break_off';
  protected rules = {
    id: { label: '可用的存休日期主键', columnType: NgxExcelColumnType.PrimaryKey },
    date: { label: '可用的存休日期', columnType: NgxExcelColumnType.Date }
  } as NgxExcelModelColumnRules<AvailableRestDate>;

}
