import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { CustomerFollowRecord } from '../../models/customer-follow-record.model';
import { of } from 'rxjs';

@Injectable()
export class CustomerFollowRecordEditComponentService extends NgxExcelComponentService {

  /**
   * 只有已邀约才能编辑预约到访时间
   * @param model 当前模型
   */
  public canEditNextVisitedTime(model: CustomerFollowRecord) {
    return model.isInvite === true;
  }

  /**
   * 只有未接受邀约才能编辑邀约失败原因
   * @param model 当前模型
   */
  public canEditInviteFailedReason(model: CustomerFollowRecord) {
    return model.isInvite === false;
  }

  /**
   * 当下次跟进开始时间发生变化时同步变化下次跟进结束时间
   * @param _ 原模型
   * @param currentModel 当前模型
   */
  public handleNextFollowBeginTimeChange(_: CustomerFollowRecord, currentModel: CustomerFollowRecord) {
    currentModel.nextFollowEndTime = currentModel.nextFollowBeginTime;
    return of([{ action: 'updated', context: currentModel }]);
  }

  /**
   * 当是否邀约发生变化时执行
   * @param _ 原模型
   * @param currentModel 当前模型
   */
  public handleIsInviteChange(_: CustomerFollowRecord, currentModel: CustomerFollowRecord) {
    if (currentModel.isInvite === true) {
      currentModel.inviteFailedReason = '';
    } else if (currentModel.isInvite === false) {
      currentModel.nextVisitedTime = '';
    } else {
      currentModel.inviteFailedReason = '';
      currentModel.nextVisitedTime = '';
    }
    return of([{ action: 'updated', context: currentModel }]);
  }

}
