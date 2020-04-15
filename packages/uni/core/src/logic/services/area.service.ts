import { Injectable } from '@angular/core';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { BaseService } from '../../services/base.service';
import { Area } from '../models/common.model';

@Injectable()
export class AreaService extends BaseService<Area> {

  protected resourceUri = 'area';
  protected resourceName = 'area';
  protected rules = {
    id: { label: '地区主键', columnType: NgxExcelColumnType.PrimaryKey, prop: 'area_id' },
    name: { label: '地区名称', columnType: NgxExcelColumnType.Text, prop: 'area_name' }
  } as NgxExcelModelColumnRules<Area>;

}
