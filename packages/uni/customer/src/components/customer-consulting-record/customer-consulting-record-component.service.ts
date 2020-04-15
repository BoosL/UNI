import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { CustomerConsultingRecordModel } from '../../models/customer-consulting-record.model';
import { of } from 'rxjs';

@Injectable()
export class CustomerConsultingRecordComponentService extends NgxExcelComponentService {

  // tslint:disable-next-line: variable-name
  constructor() {
    super();
  }

  /**
   * 课程类型
   * @param model 当前模型
   */
  public canEditCourseType(model: CustomerConsultingRecordModel) {
    return model.course;
  }

  /**
   * 课时数
   * @param model 当前模型
   */
  public canEditCourseCount(model: CustomerConsultingRecordModel) {
    return model.courseType;
  }

  /**
   * 学习时长
   * @param model 当前模型
   */
  public canEditCourseMonth(model: CustomerConsultingRecordModel) {
    return model.courseType;
  }

  /**
   * 报价金额
   * @param model 当前模型
   */
  public canEditOfferPrice(model: CustomerConsultingRecordModel) {
    return model.offerPriceStatus;
  }

  /**
   * 废turn理由
   * @param model 当前模型
   */
  public canEditInvalidationReason(model: CustomerConsultingRecordModel) {
    // tslint:disable: no-string-literal
    return model['isInvalidation'];
  }
  /**
   * 附件
   * @param model 当前模型
   */
  public canEditAttachments(model: CustomerConsultingRecordModel) {
    // tslint:disable: no-string-literal
    return model['isInvalidation'];
  }
  /**
   * 废turn描述
   * @param model 当前模型
   */
  public canEditInvalidationRemark(model: CustomerConsultingRecordModel) {
    // tslint:disable: no-string-literal
    return model['isInvalidation'];
  }

  /**
   * 验证背景描述
   * @param model 当前模型
   */
  /* public validateBackgroundInfo(model: CustomerConsultingRecordModel, newValue: string) {
    if (newValue && (newValue.length < 10 || newValue.length > 800)) {
      return '请正确输入10~800位字符';
    }
    return true;
  } */

  /**
   * 验证课程类型
   * @param model 当前模型
   */
  /* public validateCourseType(model: CustomerConsultingRecordModel, newValue: string) {
    if (!model.course) {
      return '请选择是否推荐课程';
    }
    return true;
  } */

  /**
   * 验证课时数
   * @param model 当前模型
   */
  /* public validateCourseCount(model: CustomerConsultingRecordModel, newValue: string) {
    if (!model.courseType) {
      return '请选择推荐课程';
    }
    const num = parseFloat(newValue);
    if (num < 1 || num > 999) {
      return '请正确输入1~999区间数字字符';
    }
    return true;
  } */

  /**
   * 验证学习时长
   * @param model 当前模型
   */
  /* public validateCourseMonth(model: CustomerConsultingRecordModel, newValue: string) {
    if (!model.courseType) {
      return '请选择推荐课程';
    }
    const num = parseFloat(newValue);
    if (num < 1 || num > 100) {
      return '请正确输入1~100区间数字字符';
    }
    return true;
  } */

  /**
   * 验证报价金额
   * @param model 当前模型
   */
  /* public validateOfferPrice(model: CustomerConsultingRecordModel, newValue: string) {
    if (!model.offerPriceStatus) {
      return '请选择是否报价';
    }
    if (newValue.length < 2 || newValue.length > 7 ) {
      return '请输入2~7位整数数值';
    }
    return true;
  } */
  /**
   * 验证废turn理由
   * @param model 当前模型
   */
  /* public validateInvalidationRemark(model: CustomerConsultingRecordModel, newValue: string) {
    if (!model['isInvalidation']) {
      return '请选择是否废turn';
    }
    if (newValue && (newValue.length < 10 || newValue.length > 800)) {
      return '请正确输入10~800位字符';
    }
    return true;
  } */

  /**
   * 是否推荐课程变更时
   * @param _ 原始模型
   * @param model 变更后模型
   */
  public handleCourseChanged(_: CustomerConsultingRecordModel, model: CustomerConsultingRecordModel) {
    if (model.course !== true) {
      model.courseType = null;
      model.courseCount = null;
      model.courseMonth = null;
    }
    return of([{ action: 'updated', context: model }]);
  }
  /**
   * 是否报价
   * @param _ 原始模型
   * @param model 变更后模型
   */
  public handleOfferPriceStatusChanged(_: CustomerConsultingRecordModel, model: CustomerConsultingRecordModel) {
    if (model.offerPriceStatus !== true) {
      model.offerPrice = null;
    }
    return of([{ action: 'updated', context: model }]);
  }
  /**
   * 是否废turn
   * @param _ 原始模型
   * @param model 变更后模型
   */
  public handleIsInvalidationChanged(_: CustomerConsultingRecordModel, model: CustomerConsultingRecordModel) {
    if (model['isInvalidation'] !== true) {
      model.invalidationReason = null;
      model.invalidationRemark = null;
      model.attachments = [];
    }
    if (model['isInvalidation'] === true) {
      model.contractRate = null;
    }
    return of([{ action: 'updated', context: model }]);
  }
}
