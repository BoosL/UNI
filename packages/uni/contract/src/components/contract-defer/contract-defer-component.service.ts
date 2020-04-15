import { Injectable } from '@angular/core';
import { ContractDeferredRecord } from '../../models/contract-deferred-record.model';
import {
  NgxExcelComponentService,
} from 'ngx-excel';
import { throwError, of } from 'rxjs';
import { utc } from 'moment';

@Injectable()
export class ContractDeferComponentService extends NgxExcelComponentService {

  public handleMonthChanged(originalModel: ContractDeferredRecord, model: ContractDeferredRecord) {
    const productEndTimeObj = utc(originalModel.productEndTime, 'YYYY-MM-DD');
    if (!productEndTimeObj.isValid()) {
      return throwError({ message: '未知的学习结束时间' });
    }

    if (model.month < 1 || model.month > 99) {
      return throwError({ message: '请输入 1 ~ 99 纯数字字符' });
    }

    const day = model.month * 31;
    model.startTime = productEndTimeObj.isAfter(utc()) ? productEndTimeObj.format('YYYY-MM-DD') : utc().format('YYYY-MM-DD');
    model.endTime = utc(model.startTime, 'YYYY-MM-DD').add(day, 'day').format('YYYY-MM-DD');
    return of([{ action: 'updated', context: Object.assign({}, model) }]);
  }

}
