import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { map } from 'rxjs/operators';
import { TmkCustomerFollowRecord } from '../../models/tmk-customer-follow-record.model';
import { TmkCustomerFollowRecordService } from '../../services/tmk-customer-follow-record.service';

@Injectable()
export class TmkCustomerFollowRecordEditComponentService extends NgxExcelComponentService {

  constructor(
    protected tmkFollowRecordService: TmkCustomerFollowRecordService
  ) {
    super();
  }

  public canEditTmkStatus(_: TmkCustomerFollowRecord) {
    return false;
  }
  /*
   * 通话判断变更*/
  handleActionCodeChange(originalModel: TmkCustomerFollowRecord, model: TmkCustomerFollowRecord) {
    return this.tmkFollowRecordService.getModel(model.actionCode.id, { customerId: model.relativeMarketingCustomer.id }).pipe(
      map((res) => {
        model.tmkStatus = res.tmkStatus;
        model.isEnableNextTime = res.isEnableNextTime;
        model.isEnableReservationTime = res.isEnableReservationTime;
        return [{ action: 'updated', context: model }];
      })
    );
  }
}
