import { Injectable } from '@angular/core';
import { EmployeeService } from '../../../logic/logic';

@Injectable()
export class ProfileService extends EmployeeService {

  /**
   * @inheritdoc
   */
  public getModel(_: string, filters?: { [name: string]: string | string[]; }) {
    return super.getModel('_current', filters);
  }

  /**
   * @inheritdoc
   */
  public save(payload: { [name: string]: any }, primaryKey?: string) {
    return super.save(payload, primaryKey ? '_current' : null);
  }

  /**
   * @inheritdoc
   */
  public update(payload: { [name: string]: any; }, _: string) {
    return super.update(payload, '_current');
  }

}
