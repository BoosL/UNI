import {Injectable} from '@angular/core';
import {NgxExcelComponentService} from 'ngx-excel';
import {CurriculumScheduleModel} from '../models/curriculum-schedule.model';

@Injectable()
export class CurriculumSchedulesEditComponentService extends NgxExcelComponentService {
  /**
   * 判断是否能编辑原来的用途
   * @param model 模型
   */
  public canEditProduct(model: CurriculumScheduleModel) {
    return model.productType && model.productType.value;
  }

  public canEditSubject(model: CurriculumScheduleModel) {
    return model.product && model.product.id;
  }

  public canEditCurriculum(model: CurriculumScheduleModel) {
    return model.subject && model.subject.id;
  }
}
