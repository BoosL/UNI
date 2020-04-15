import { Injectable } from '@angular/core';
import { Classroom, ClassroomService } from '@uni/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { throwError, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SchoolClassroomsComponentService extends NgxExcelComponentService {

  public autoCommitKeys = [
    'name', 'frequencyName', 'capacityNum', 'roomSizeType', 'isSupportVideo', 'isSupportVideo', 'remark', 'status',
    'isStandard', 'originalPurpose', 'schoolId'
  ];

  constructor(
    private classroomService: ClassroomService
  ) {
    super();
  }

  /**
   * 判断是否能编辑原来的用途
   * @param model 模型
   */
  public canEditOriginalPurpose(model: Classroom) {
    return !model.isStandard;
  }

  /**
   * 当标准型发生变更时执行
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleIsStandardChanged(originalModel: Classroom, model: Classroom) {
    model.originalPurpose = '';
    if (!model.isStandard) {
      return of([{ action: 'updated', context: model }]);
    }

    return this.classroomService.save(model, originalModel.id).pipe(
      map((classroom) => [{ action: 'updated', context: classroom }])
    );
  }

  /**
   * 当教室状态发生变更时执行
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleStatusChanged(originalModel: Classroom, model: Classroom) {
    if (!originalModel || !model) {
      return throwError(new Error('当前状态不可变更'));
    }

    if (originalModel.status.value === model.status.value) {
      if (model.status.value === '0') {
        return throwError(new Error('当前状态不可禁用'));
      }
      if (model.status.value === '1') {
        return throwError(new Error('当前状态不可启用'));
      }
    }

    return this.classroomService.save(model, originalModel.id).pipe(
      map((classroom) => [{ action: 'updated', context: classroom }])
    );

  }

}
