import { Injectable } from '@angular/core';
import { SchoolMenu } from '../models/school-menu.model';
import { BaseViewFilterService } from './base-view-filter-service';
import { of } from 'rxjs';

@Injectable()
export class SchoolMenuService extends BaseViewFilterService<SchoolMenu> {

  public name = 'currentSchoolId';

  public get currentSchool() {
    return this.currentMenuItem;
  }

  public get currentSchool$() {
    return this.currentMenuItem$;
  }

  /**
   * @inheritdoc
   */
  protected getAvailableMenuItems() {
    const schoolMenuItems: SchoolMenu[] = [];
    const employee = this.getCurrentEmployee();
    if (employee) {
      schoolMenuItems.push(...employee.relativeSchools);
    }
    return of(schoolMenuItems);
  }

  /**
   * @inheritdoc
   */
  protected getDefaultSelectedMenuItem() {
    const employee = this.getCurrentEmployee();
    return employee ? employee.school : null;
  }

}
