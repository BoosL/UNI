import { Injectable } from '@angular/core';
import { EmployeeMenu } from '../models/employee-menu.model';
import { BaseViewFilterService } from './base-view-filter-service';
import { of } from 'rxjs';

@Injectable()
export class EmployeeMenuService extends BaseViewFilterService<EmployeeMenu> {

  public name = 'currentEmployeeMenuId';

  public get currentEmployeeMenu() {
    return this.currentMenuItem;
  }

  public get currentEmployeeMenu$() {
    return this.currentMenuItem$;
  }

  /**
   * @inheritdoc
   */
  protected getAvailableMenuItems() {
    const employeeMenuItems: EmployeeMenu[] = [];
    const employee = this.getCurrentEmployee();
    if (employee) {
      employeeMenuItems.push(employee);
    }
    return of(employeeMenuItems);
  }

  /**
   * @inheritdoc
   */
  protected getDefaultSelectedMenuItem() {
    return this.getCurrentEmployee();
  }

  /**
   * @inheritdoc
   */
  public change(employeeMenu: EmployeeMenu) {
    if (employeeMenu) {
      const currentEmployeeMenu = Object.assign({}, employeeMenu);
      const employee = this.getDefaultSelectedMenuItem();
      if (employee && employee.id === employeeMenu.id) {
        currentEmployeeMenu.name = '当前登陆用户视角';
      }
      this.currentMenuItem = currentEmployeeMenu;
      this.setSessionCurrentId(currentEmployeeMenu.id);
    } else {
      this.currentMenuItem = null;
      this.clear();
    }
    this.emit();
  }

}
