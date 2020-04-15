import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelColumnType } from 'ngx-excel';
import {
  BackendService,
  StudentService,
  ProductService,
  SchoolService,
  EmployeeService
} from '@uni/core';
import { StudentExtService } from '@uni/student';
import { StudentSearch } from '../models/student-search.model';
import { Enums } from '../../_enums';

@Injectable({ providedIn: 'root' })
export class StudentsSearchService extends StudentExtService {

  protected resourceUri = '';
  protected resourceName = '';
  protected extendRules = {
    keyWord: {
      label: '关键字', columnType: NgxExcelColumnType.Text
    },
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected productService: ProductService,
    protected schoolService: SchoolService,
    protected employeeService: EmployeeService,
  ) {
    super(httpClient, backendService, productService, schoolService, employeeService);
  }

  public getRules() {
    return Object.assign({}, super.getRules(), this.extendRules);
  }

  /**
   * 获得查询条件
   * @param model 模型
   */
  public getConditions(model: StudentSearch): { [name: string]: string | string[] } {
    console.log(model, 'model11')
    return super.resolveBody(model);
  }

}
