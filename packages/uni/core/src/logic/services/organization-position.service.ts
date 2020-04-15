import { Injectable } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { Organization, Position } from '../models/organization-position.model';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { Enums } from '../enums';

@Injectable()
export class OrganizationService extends BaseService<Organization> {

  protected resourceUri = '';
  protected resourceName = '';

  protected rules = {
    id: {
      label: '组织主键', columnType: NgxExcelColumnType.PrimaryKey, prop: 'organization_id'
    },
    idPath: {
      label: '组织关系主键链', columnType: NgxExcelColumnType.Text, prop: 'organization_id_path'
    },
    nameShort: {
      label: '短组织名称', columnType: NgxExcelColumnType.Text, prop: 'organization_name'
    },
    name: {
      label: '组织名称', columnType: NgxExcelColumnType.Text,
      resolveValue: (o: any) => this.resolveName(o)
    },
    parentId: {
      label: '父组织主键', columnType: NgxExcelColumnType.Text,
      resolveValue: (o: any) => this.resolveParentId(o)
    }
  } as NgxExcelModelColumnRules<Organization>;

  protected resolveName(o: any) {
    if (!o.organization_name_path) { return ''; }
    const namePaths = o.organization_name_path.split('//').filter((namePath: string) => namePath.length > 0);
    return namePaths.join(' / ');
  }

  protected resolveParentId(o: any) {
    if (!o.parent_id) { return ''; }
    return o.parent_id === '0' ? '' : `${o.parent_id}`;
  }

}

@Injectable()
export class PositionService extends BaseService<Position> {

  protected resourceUri = '';
  protected resourceName = '';

  protected rules = {
    id: {
      label: '职位主键', columnType: NgxExcelColumnType.PrimaryKey, prop: 'position_id'
    },
    name: {
      label: '职位名称', columnType: NgxExcelColumnType.Text, prop: 'position_name'
    },
    type: {
      label: '职位级别', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.OrganizationPosition.Type), prop: 'position_type'
    }
  } as NgxExcelModelColumnRules<Position>;

}
