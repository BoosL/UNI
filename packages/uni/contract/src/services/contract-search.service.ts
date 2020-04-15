import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  BaseService,
  BackendService
} from '@uni/core';
import {NgxExcelModelColumnRules, NgxExcelColumnType} from 'ngx-excel';
import {ContractStudentService} from './contract-student.service';
import {ContractSearch} from '../models/contract-search.model';
import {ContractStudent} from '../models/contract-student.model';

@Injectable({ providedIn: 'root' })
export class ContractSearchService extends BaseService<ContractSearch> {
  protected resourceUri = '';
  protected resourceName = '';
  protected rules = {
    sn: { label: '合同编号', columnType: NgxExcelColumnType.Text, prop: 'contract_number' },
    student: {
      label: '签署学员',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.studentService,
      labelKey: 'name',
      typeaheadKey: 'name',
      prop: 'student'
    },
    createTime: { label: '创建时间', columnType: NgxExcelColumnType.DateRange, prop: 'create_time' },
    beginTime: { label: '合同开始时间', columnType: NgxExcelColumnType.DateRange, prop: 'begin_time' }
  } as NgxExcelModelColumnRules<ContractSearch>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected studentService: ContractStudentService
  ) {
    super(httpClient, backendService);
  }

  public getStudentForeignModels(model: ContractSearch, keyword?: string): Observable<ContractStudent[]> {
    const params = {};
    if (keyword) {
      // tslint:disable: no-string-literal
      params['keyword'] = keyword;
    }
    return this.studentService.getList(params, 1, 20) as Observable<ContractStudent[]> ;
  }
  public getConditions(model: ContractSearch) {
      return this.resolveBody(model);
  }

}
