import { Injectable } from '@angular/core';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { BaseService } from '../../services/base.service';
import { SalaryTemplate } from '../models/price.model';

@Injectable()
export class SalaryTemplateService extends BaseService<SalaryTemplate> {

  protected resourceUri = 'curriculum_type_fee_tpl';
  protected resourceName = 'curriculum_type_fee_tpl';
  protected rules = {
    id: { label: '课酬策略模板主键', columnType: NgxExcelColumnType.PrimaryKey },
    name: { label: '课酬策略模板名称', columnType: NgxExcelColumnType.Text }
  } as NgxExcelModelColumnRules<SalaryTemplate>;

}
