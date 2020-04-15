import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { Enums } from '../enums';
import { BaseService } from '../../services/base.service';
import { BackendService } from '../../services/backend.service';
import { BaseSchool, School } from '../models/school.model';
import { AreaService } from './area.service';
import { PriceRuleTemplateService } from './price-rule-template.service';
import { SalaryTemplateService } from './salary-template.service';

export abstract class BaseSchoolService<T extends BaseSchool> extends BaseService<T> {

  protected rules = {
    id: {
      label: '学校主键',
      columnType: NgxExcelColumnType.PrimaryKey,
      prop: 'campus_id'
    },
    name: {
      label: '学校名称',
      columnType: NgxExcelColumnType.Text,
      prop: 'campus_name'
    },
    nameCn: {
      label: '学校名称（中文）',
      columnType: NgxExcelColumnType.Text,
      prop: 'campus_name'
    },
    nameEn: {
      label: '学校名称（英文）',
      columnType: NgxExcelColumnType.Text,
      prop: 'campus_english_name'
    }
  } as NgxExcelModelColumnRules<T>;

}

@Injectable()
export class SchoolService extends BaseSchoolService<School> {

  protected resourceUri = 'campus';
  protected resourceName = 'campus';
  protected additionalRules = {
    alias: {
      label: '学校别称',
      columnType: NgxExcelColumnType.Text,
      prop: 'campus_full_name',
      optional: true
    },
    code: {
      label: '学校代号',
      columnType: NgxExcelColumnType.Text,
      prop: 'campus_abbreviation',
      optional: true
    },
    company: {
      label: '公司名称',
      columnType: NgxExcelColumnType.Text,
      prop: 'company_name',
      optional: true
    },
    address: {
      label: '学校地址',
      columnType: NgxExcelColumnType.Text,
      prop: 'campus_addr',
      optional: true
    },
    tel: {
      label: '学校电话',
      columnType: NgxExcelColumnType.Text,
      prop: 'campus_phone',
      optional: true
    },
    relativeArea: {
      label: '所属地区',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.areaService,
      labelKey: 'name',
      optional: true,
      resolveValue: (o: any) => this.resolveRelativeArea(o)
    },
    relativePriceRuleTemplate: {
      label: '关联的价格策略',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.priceRuleTemplateService,
      labelKey: 'name',
      resolveValue: (o: any) => this.resolveRelativePriceRuleTemplate(o)
    },
    relativeSalaryTemplate: {
      label: '关联的课酬模板',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.salaryTemplateService,
      labelKey: 'name',
      resolveValue: (o: any) => this.resolveRelativeSalaryTemplate(o)
    },
    relativeOrganizationId: {
      label: '关联的组织架构主键',
      columnType: NgxExcelColumnType.TextNumber,
      resolveValue: (o: any) => this.resolveRelativeOrganizationId(o)
    },
    status: {
      label: '学校状态',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.School.Status)
    }
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected areaService: AreaService,
    protected priceRuleTemplateService: PriceRuleTemplateService,
    protected salaryTemplateService: SalaryTemplateService
  ) {
    super(httpClient, backendService);
  }

  protected resolveRelativeArea(o: any) {
    return this.areaService.createModel(null, o);
  }

  protected resolveRelativePriceRuleTemplate(o: any) {
    if (!o.price_rule_template_name) { return null; }
    return this.priceRuleTemplateService.createModel({ id: '9999', name: o.price_rule_template_name });
  }

  protected resolveRelativeSalaryTemplate(o: any) {
    if (!o.curriculum_type_fee_tpl_id || !o.curriculum_type_fee_tpl) { return null; }
    return this.salaryTemplateService.createModel({ id: o.curriculum_type_fee_tpl_id, name: o.curriculum_type_fee_tpl });
  }

  protected resolveRelativeOrganizationId(o: any) {
    return o.organization_id ? `${o.organization_id}` : '';
  }

}
