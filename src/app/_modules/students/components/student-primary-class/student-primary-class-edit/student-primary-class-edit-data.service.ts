import {Injectable} from '@angular/core';
import {NgxExcelDataService} from 'ngx-excel';
import {School, Employee, EmployeeService, SchoolMenu} from '@uni/core';
import {AuthService} from '@uni/common';
import {of} from 'rxjs';
import {StudentsPrimaryClass, StudentPrimaryClassService, StudentsClass} from '@uni/student';

@Injectable()
export class StudentPrimaryClassEditDataService extends NgxExcelDataService<StudentsPrimaryClass> {

  constructor(
    protected excel: StudentPrimaryClassService,
    protected authService: AuthService,
    protected employeeService: EmployeeService
  ) {
    super();
  }


  /**
   * @inheritdoc
   */
  public getRules() {
    return this.excel.getRules();
  }

  public createModel(attributes?: Partial<StudentsPrimaryClass>, o?: any) {
    return this.excel.createModel(attributes, o);
  }

  /**
   * 获得当前登陆员工
   */
  protected getCurrentEmployee(): Employee {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? this.employeeService.createModel(null, currentUser) : null;
  }

  /**
   * 获取学员的产品下拉列表
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public getCampusForeignModels(model: StudentsPrimaryClass, keyword?: string) {
    const schoolMenuItems: SchoolMenu[] = [];
    const employee = this.getCurrentEmployee();
    if (employee) {
      schoolMenuItems.push(...employee.relativeSchools);
    }
    return of(schoolMenuItems);
  }

  public save(model: StudentsPrimaryClass) {
    // tslint:disable: no-string-literal
    const condition = {
      name: model.name,
      importance_type: model.importance ? model.importance.value : '',
      school_id: model.school.id,
      students: this._getStudent(model['studentsClass']),
      remark: model.remark
    };
    return this.excel.save(condition);
  }

  private _getStudent(studentsClass: StudentsClass[]) {
    const students = [];
    if (studentsClass && studentsClass.length > 0) {
      studentsClass.forEach((item) => {
        students.push({
          id: item.student ? item.student.id : '',
          product_id: item.product ? item.product.id : '',
          remark: item.remark || '',
        });
      });
    }
    return students;
  }


}
