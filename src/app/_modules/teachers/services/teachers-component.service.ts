import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { Employee, TeacherService } from '@uni/core';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TeachersComponentService extends NgxExcelComponentService {

  constructor(
    protected teacherService: TeacherService
  ) {
    super();
  }

  /**
   * 当老师标签发生变化时执行
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleTagsChanged(originalModel: Employee, model: Employee) {
    if (!originalModel || !model) {
      return throwError(new Error('当前状态不可变更'));
    }

    return this.teacherService.save({ tags: model.tags, schoolId: model['schoolId'] }, originalModel.id).pipe(
      map((employee) => [{ action: 'updated', context: employee }])
    );
  }

}
