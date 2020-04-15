import { Injectable } from '@angular/core';
import { NgxExcelDataService } from 'ngx-excel';
import { School, StudentBoughtProductService } from '@uni/core';
import {
  StudentsClass,
  StudentClassService,
  StudentExtService
} from '@uni/student';
@Injectable()
export class StudentPrimaryClassEditUczeDataService extends NgxExcelDataService<StudentsClass> {

  constructor(
    protected excel: StudentClassService,
    protected studentService: StudentExtService,
    protected studentProductsService: StudentBoughtProductService
  ) {
    super();
  }


  /**
   * @inheritdoc
   */
  public getRules() {
    return this.excel.getRules();
  }

  public createModel(attributes?: Partial<StudentsClass>, o?: any) {
    return this.excel.createModel(attributes, o);
  }

  /**
   * 获取校区学员下拉列表
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public getStudentForeignModels(model: StudentsClass, keyword?: string) {
    // tslint:disable: no-string-literal
    const param = {
      school_id: model['relativeSchoolId'],
      bought_product_type: '4'
    };
    if (keyword) {
      param['keyword'] = keyword;
    }
    return this.studentService.getList(param);
  }



  /**
   * 获取学员的产品下拉列表
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public getProductForeignModels(model: StudentsClass, keyword?: string) {
    const param = {
      school_id: model['relativeSchoolId'],
      student_id: model.student.id,
      type: '4'
    };
    if (keyword) {
      param['keyword'] = keyword;
    }
    return this.studentProductsService.getList(param);
  }







}
