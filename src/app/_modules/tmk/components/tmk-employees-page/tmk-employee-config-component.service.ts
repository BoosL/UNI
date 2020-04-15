import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { TmkEmployeeConfig } from '../../models/tmk-employee.model';
import { TmkEmployeeConfigService } from '../../services/tmk-employee-config.service';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class TmkEmployeeConfigComponentService extends NgxExcelComponentService {

  constructor(
    protected employeeConfigService: TmkEmployeeConfigService
  ) {
    super();
  }

  /**
   * 当是否参与数据分配发生变化时执行
   * @param originalModel 原模型
   * @param currentModel 当前模型
   */
  public handleAcceptChange(originalModel: TmkEmployeeConfig, currentModel: TmkEmployeeConfig) {
    if (currentModel.accept && originalModel.relativeSources.length === 0) {
      return of([ { action: 'updated', context: currentModel } ]);
    }
    const payload = currentModel.accept ? {
      accept: currentModel.accept,
      // sources: []
    } : {
      accept: currentModel.accept
    };
    return this.employeeConfigService.update(payload, currentModel.id).pipe(
      map((context) => [{ action: 'updated', context: Object.assign({}, context) }]),
      tap((x) => console.log(x))
    );
  }

}
