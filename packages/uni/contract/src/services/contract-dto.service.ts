import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BaseService, BackendService,  ProductService, ProductSubjectService, ContractService} from '@uni/core';
import {NgxExcelColumnType, NgxExcelModelColumnRules, NgxExcelService} from 'ngx-excel';
import {Observable, of} from 'rxjs';
import {ContractSchoolService} from './contract-school.service';
import {ContractStudentService} from './contract-student.service';
import {ContractEmployeeService} from './contract-employee.service';
import {ContractDto, Instalment} from '../models/contract-dto.model';
import {MarketingCustomerService, MarketingCustomer} from '@uni/customer';

@Injectable({providedIn: 'root'})
export class InstalmentService extends BaseService<Instalment> {
  protected resourceUri = '';
  protected resourceName = '';
  protected rules = {
    instalmentBank: { label: '分期银行', columnType: NgxExcelColumnType.Text, prop: 'instalment_bank' },
    instalmentNum: { label: '分期期数', columnType: NgxExcelColumnType.Text, prop: 'instalment_num' },
    instalmentRate: { label: '分期费率', columnType: NgxExcelColumnType.Text, prop: 'instalment_rate' },
    instalmentFee: { label: '分期手续费', columnType: NgxExcelColumnType.Text, prop: 'instalment_fee' },
    instalmentAmount: { label: '分期金额', columnType: NgxExcelColumnType.Text, prop: 'instalment_amount' },
    instalmentBankName: { label: '分期银行', columnType: NgxExcelColumnType.Text, prop: 'instalment_bank_name' },
  };
}

@Injectable({providedIn: 'root'})
export class ContractDtoService extends ContractService<ContractDto> {
  protected resourceUri = '';
  protected resourceName = '';
  protected extendsRules = {
    previewUrl: {name: 'previewUrl', label: '合同预览', columnType: NgxExcelColumnType.Url, prop: 'url' },
    relativeProducts: {
      name: 'relativeProducts',
      label: '合同相关产品',
      columnType: NgxExcelColumnType.MultiForeignKey,
      relativeService: this.productService,
      labelKey: 'name',
      prop: 'products'
    },
    relativeSubjects: {
      name: 'relativeSubjects',
      label: '合同相关科目',
      columnType: NgxExcelColumnType.MultiForeignKey,
      relativeService: this.productSubjectService,
      labelKey: 'name',
      prop: 'subjects'
    },
    productEndTime: {  name: 'productEndTime', label: '学习结束时间', columnType: NgxExcelColumnType.Date, prop: 'product_expired_at' },
    instalment: {
      name: 'instalment',
      label: '分期信息',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.instalmentService
    },
    isInstalment: {  name: 'isInstalment', label: '是否分期', columnType: NgxExcelColumnType.Bool, prop: 'is_instalment' },
    downPayment: { name: 'downPayment', label: '首付金额', columnType: NgxExcelColumnType.Currency, prop: 'down_payment' },
    customer: {
      name: 'customer', label: '客户信息', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerService as NgxExcelService<MarketingCustomer>, labelKey: 'name', typeaheadKey: 'keyword',
      optional: true
    },
    isDeposit: {
      name: 'isDeposit', label: '使用订金', columnType: NgxExcelColumnType.Bool
    },
    unpaidAmount: { name: 'unpaidAmount', label: '待收金额', columnType: NgxExcelColumnType.Currency, prop: 'unpaid_amount' },
    serverAmount: { name: 'serverAmount', label: '分期服务费', columnType: NgxExcelColumnType.Text, prop: 'server_amount' },
  };
  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: ContractSchoolService,
    protected studentService: ContractStudentService,
    protected employeeService: ContractEmployeeService,
    protected productService: ProductService,
    protected productSubjectService: ProductSubjectService,
    protected instalmentService: InstalmentService,
    protected customerService: MarketingCustomerService,
  ) {
    super(httpClient, backendService, schoolService, studentService, employeeService);
  }

  public getRules(): NgxExcelModelColumnRules<ContractDto> {
    return Object.assign({}, this.extendsRules, super.getRules());
  }

  public getDynamicColumnPrefix(): string {
    return '';
  }
  /**
   * 动态增删表列
   * @param school 校区
   */
  public handleDynamicColumns(schoolId: string): Observable<any> {
    return of(null);
  }
}
