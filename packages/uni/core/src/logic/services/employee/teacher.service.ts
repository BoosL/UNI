import { Injectable } from '@angular/core';
import { NgxExcelColumnType } from 'ngx-excel';
import { EmployeeService } from './employee.service';
import { Employee } from '../../models/employee.model';
import { Enums } from '../../enums';

@Injectable()
export class TeacherService extends EmployeeService {

  protected resourceUri = 'campuses/{school_id}/teachers';
  protected resourceName = 'teachers';

  /**
   * 重写状态字段规则
   */
  public getRules() {
    const rules = super.getRules();
    rules.status = {
      label: '当前状态',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Teacher.Status)
    };
    return rules;
  }

  /**
   * 判断员工是否一个 Etp 老师
   * @param model 待判断的模型
   */
  public isEtp(model: Employee) {
    return model.tags.some((tag) => tag.value === '1');
  }

}
