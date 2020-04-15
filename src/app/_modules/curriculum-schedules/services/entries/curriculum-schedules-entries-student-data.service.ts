import {Injectable} from '@angular/core';
import {
  SchoolService,
  StudentService,
  EmployeeService,
  Employee,
  SchoolMenu
} from '@uni/core';
import {AuthService} from '@uni/common';
import {of} from 'rxjs';
import {NgxExcelDataService} from 'ngx-excel';
import {RelativeEntity} from '../../models/curriculum-schedule.model';
import {EntryStudentModel} from '../../models/entry-student.model';


@Injectable()
export class CurriculumSchedulesEntriesStudentDataService extends NgxExcelDataService<RelativeEntity | EntryStudentModel> {
  // tslint:disable: variable-name
  private _rules: any;

  constructor(
    protected schoolService: SchoolService,
    protected studentService: StudentService,
    protected authService: AuthService,
    protected employeeService: EmployeeService
  ) {
    super();
  }

  public setRules(rules: any) {
    this._rules = rules;
  }

  /**
   * @inheritdoc
   */
  public getRules() {
    return this._rules;
  }
  /**
   * 获得当前登陆员工
   */
  protected getCurrentEmployee(): Employee {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? this.employeeService.createModel(null, currentUser) : null;
  }
  /**
   * 获取学员校区列表
   * @param model 模型
   * @param keyword 关键字
   */
  public getRelativeSchoolForeignModels(model: RelativeEntity, keyword?: string) {
    const schoolMenuItems: SchoolMenu[] = [];
    const employee = this.getCurrentEmployee();
    if (employee) {
      schoolMenuItems.push(...employee.relativeSchools);
    }
    return of(schoolMenuItems);
  }

  /**
   * 获取校区学员列表
   * @param model 模型
   * @param keyword 关键字
   */
  public getStudentForeignModels(model: RelativeEntity, keyword?: string) {
    const param = {
      // tslint:disable: no-string-literal
      bought_product_type: model['productType'].value,
      school_id: model.relativeSchool.id,
      meta: 'total',
      bought_curriculum_id: model['curriculumId']
    };
    if (keyword) {
      param['keyword'] = keyword;
    }
    return this.studentService.getList(param, 1, 20);
  }
}
