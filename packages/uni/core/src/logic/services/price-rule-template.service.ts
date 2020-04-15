import { Injectable } from '@angular/core';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { BaseService } from '../../services/base.service';
import { PriceRuleTemplate } from '../models/price.model';

@Injectable()
export class PriceRuleTemplateService extends BaseService<PriceRuleTemplate> {

  protected resourceUri = 'price_rule_templates';
  protected resourceName = 'price_rule_templates';
  protected rules = {
    id: { label: '价格策略模板主键', columnType: NgxExcelColumnType.PrimaryKey },
    name: { label: '价格策略模板名称', columnType: NgxExcelColumnType.Text }
  } as NgxExcelModelColumnRules<PriceRuleTemplate>;

}
