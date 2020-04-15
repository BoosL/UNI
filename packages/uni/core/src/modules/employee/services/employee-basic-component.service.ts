import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { Employee, TeacherService, EmployeeService } from '../../../logic/logic';
import { tap, mergeMap, map } from 'rxjs/operators';

@Injectable()
export class EmployeeBasicComponentService extends NgxExcelComponentService {

  /**
   * @inheritdoc
   */
  public autoCommitKeys = ['portrait', 'phoneNumber', 'officeNumber', 'backupPhoneNumber', 'email', 'qq', 'address'];

  constructor(
    protected employeeService: EmployeeService,
    protected teacherService: TeacherService
  ) {
    super();
  }

  /**
   * 判断是否可以编辑教学风格
   * @param model 待判断的模型
   */
  canEditStyles(model: Employee) {
    return this.employeeService.isTeacherRole(model);
  }

  /**
   * 更新教学风格
   * @param originalModel 原始模型
   * @param model 更新后模型
   */
  handleStylesChanged(originalModel: Employee, model: Employee) {
    const payload: any = { styles: model.styles };
    if (originalModel.school) {
      payload.schoolId = originalModel.school.id;
    }
    return this.teacherService.update(payload, originalModel.id).pipe(
      mergeMap(() => this.employeeService.getModel(originalModel.id)),
      map((context) => [{ action: 'updated', context: Object.assign({}, context) }])
    );
  }

}
