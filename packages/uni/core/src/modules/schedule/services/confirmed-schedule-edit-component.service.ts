import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { ConfirmedScheduleEditModel } from '../models/confirmed-schedule-edit.model';

@Injectable()
export class ConfirmedScheduleEditComponentService extends NgxExcelComponentService {

  public canEditRestDates(editModel: ConfirmedScheduleEditModel) {
    if (!editModel.scheduleType) { return false; }
    return editModel.scheduleType.value === '5';
  }

}
