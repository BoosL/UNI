import {Injectable} from '@angular/core';
import {
  SchoolService,
  EmployeeService,
  Employee,
  SchoolMenu
} from '@uni/core';
import {AuthService} from '@uni/common';
import {of} from 'rxjs';
import {NgxExcelDataService} from 'ngx-excel';
import {RelativeEntity} from '../../models/curriculum-schedule.model';
import {RelativeEntryService} from '../../_services/relative-entry.service';
import {SmallClassService} from '../../_services/small-class.service';


@Injectable()
export class CurriculumSchedulesEntriesClassDataService extends NgxExcelDataService<RelativeEntity> {
  // tslint:disable: variable-name
  constructor(
    protected relativeEntityService: RelativeEntryService,
    protected schoolService: SchoolService,
    protected smallClassService: SmallClassService,
    protected authService: AuthService,
    protected employeeService: EmployeeService
  ) {
    super();
  }

  /**
   * @inheritdoc
   */
  public getRules() {
    return this.relativeEntityService.getRules();
  }
  /**
   * 获得当前登陆员工
   */
  protected getCurrentEmployee(): Employee {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? this.employeeService.createModel(null, currentUser) : null;
  }
  /**
   * 获取小班校区列表
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
   * 获取校区小班列表
   * @param model 模型
   * @param keyword 关键字
   */
  public getSmallClassForeignModels(model: RelativeEntity, keyword?: string) {
    const param = {
      // tslint:disable-next-line: no-string-literal
      type: model['productType'].value,
      school_id: model.relativeSchool.id,
      meta: 'total'
    };
    if (keyword) {
      // tslint:disable-next-line: no-string-literal
      param['keyword'] = keyword;
    }
    return this.smallClassService.getList(param, 1, 20);
  }

}
