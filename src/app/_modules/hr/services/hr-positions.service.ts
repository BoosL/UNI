import { Injectable } from '@angular/core';
import { NgxExcelColumnType } from 'ngx-excel';
import { PositionService } from '@uni/core';

@Injectable({ providedIn: 'root' })
export class HrPositionService extends PositionService {

  protected resourceUri = 'v2/position';
  protected resourceName = 'position';

  protected extraRules = {
    count: {
      label: '关联组织数量', columnType: NgxExcelColumnType.Text, prop: 'organization_position_maps_count'
    },
    createdTime: {
      label: '创建时间', columnType: NgxExcelColumnType.Text, prop: 'created_at'
    },
    updatedTime: {
      label: '更新时间', columnType: NgxExcelColumnType.Text, prop: 'updated_at',
    }
  };

  public getRules() {
    const rules = super.getRules();
    return Object.assign({}, rules, this.extraRules);
  }


}
