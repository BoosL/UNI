import {Injectable} from '@angular/core';
import {
  SchoolAvailableProductService,
  SchoolAvailableSubjectService,
  SchoolAvailableCurriculumService,
  SchoolService,
  TeacherService, Employee
} from '@uni/core';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';
import {NgxExcelDataService} from 'ngx-excel';
import {CurriculumScheduleService} from '../_services/curriculum-schedule.service';
import {CurriculumScheduleModel} from '../models/curriculum-schedule.model';

@Injectable()
export class CurriculumSchedulesEditBasicDataService extends NgxExcelDataService<CurriculumScheduleModel> {

  protected schoolResourceTeacherIds: string[];

  constructor(
    protected curriculumSchedulesService: CurriculumScheduleService,
    protected productService: SchoolAvailableProductService,
    protected subjectService: SchoolAvailableSubjectService,
    protected curriculumService: SchoolAvailableCurriculumService,
    protected teacherService: TeacherService,
    protected schoolService: SchoolService,
  ) {
    super();
  }

  /**
   * @inheritdoc
   */
  public getRules() {
    return this.curriculumSchedulesService.getRules();
  }

  public createModel(attributes?: Partial<CurriculumScheduleModel>, o?: any) {
    return this.curriculumSchedulesService.createModel(attributes, o);
  }

  public setResourceTeacherIds(ids: string[]) {
    this.schoolResourceTeacherIds = ids;
  }

  /**
   * 获取校区可用产品列表
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public getProductForeignModels(model: CurriculumScheduleModel, keyword?: string) {
    const param = {
      type: model.productType.value.toString(),
      schoolId: model.school.id
    };
    if (keyword) {
      // tslint:disable-next-line: no-string-literal
      param['keyword'] = keyword;
    }
    return this.productService.getList(param, 1, 20);
  }

  /**
   * 获取校区可用科目列表
   * @param model 模型
   * @param keyword 关键字
   */
  public getSubjectForeignModels(model: CurriculumScheduleModel, keyword?: string) {
    const param = {
      schoolId: model.school.id,
      product_id: model.product.id,
    };
    return this.subjectService.getList(param);
  }

  /**
   * 获取校区可用课程列表
   * @param model 模型
   * @param keyword 关键字
   */
  public getCurriculumForeignModels(model: CurriculumScheduleModel, keyword?: string) {
    if (model.subject && model.subject.id) {
      const param = {
        school_id: model.school.id,
        product_id: model.product.id,
        subject_id: model.subject.id,
        meta: 'total',
      };
      if (keyword) {
        // tslint:disable-next-line: no-string-literal
        param['keyword'] = keyword;
      }
      return this.curriculumService.getList(param, 1, 20);
    }
    return of([]);
  }

  /**
   * 获取校区老师列表
   * @param model 模型
   * @param keyword 关键字
   */
  public getTeacherForeignModels(model: CurriculumScheduleModel, keyword?: string) {
    const param = {
      school_id: model.school.id,
      meta: 'total',
      time: model.time
    };
    if (keyword) {
      // tslint:disable: no-string-literal
      param['keyword'] = keyword;
    }
    const etpType = this.productService.getEtpProductTypes().find( (item) => item.value === model.productType.value);
    if (etpType) {
      param['scope'] = 'etp';
    }
    return this.teacherService.getList(param, 1, 20).pipe(
      map((res: Employee[]) => {
        res.map((item) => {
          if (this.schoolResourceTeacherIds && (this.schoolResourceTeacherIds.includes(item.id.toString()))) {
            item.name = (model.teacher && item.id === model.teacher.id) ? item.name : '(已占用)' + item.name;
          } else if (item.status && item.status.value !== '21') {
            item.name = `（${item.status.label}) ${item.name}`;
          }
        });
        return res;
      })
    );
  }
}
