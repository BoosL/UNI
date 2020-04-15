import {Injectable} from '@angular/core';
import {
  SchoolService,
  ProductService,
  SelectOption,
  StudentBoughtSubjectService
} from '@uni/core';
import {of, Subject, Observable} from 'rxjs';
import {NgxExcelDataService} from 'ngx-excel';
import {CurriculumScheduleModel, RelativeEntity} from '../models/curriculum-schedule.model';
import {RelativeEntryService} from '../_services/relative-entry.service';
import {StudentBoughtSubject} from "../../../../../packages/uni/core/src/logic/models/student-bought-curriculum-manager.model";

@Injectable()
export class CurriculumSchedulesEditEntriesDataService extends NgxExcelDataService<RelativeEntity> {
  // tslint:disable: variable-name
  private _componentValue: CurriculumScheduleModel;
  protected availableRelativeEntriesSubject = new Subject<any>();

  constructor(
    protected relativeEntityService: RelativeEntryService,
    protected schoolService: SchoolService,
    protected productService: ProductService,
    protected studentBoughtSubjectService: StudentBoughtSubjectService
  ) {
    super();
  }

  /**
   * @inheritdoc
   */
  public getRules() {
    return this.relativeEntityService.getRules();
  }

  public createModel(attributes?: Partial<RelativeEntity>, o?: any) {
    return this.relativeEntityService.createModel(attributes, o);
  }

  public setComponentValue(res: CurriculumScheduleModel) {
    this._componentValue = res;
  }
  /**
   * 更改上课实体
   */
  public setRelativeEntity(model: RelativeEntity) {
    if (this._componentValue.relativeEntries) {
      this._componentValue.relativeEntries.forEach((item) => {
        if (item.id === model.id) {
          this._componentValue.relativeEntries.splice(this._componentValue.relativeEntries.indexOf(item), 1, model);
          // this.handleChange.emit(this._componentValue);
          this.availableRelativeEntriesSubject.next(this._componentValue);
        }
      });
    }
  }

  public getAvailableRelativeEntriesSubject(): Observable<CurriculumScheduleModel> {
    return this.availableRelativeEntriesSubject as Observable<CurriculumScheduleModel>;
  }

  public canAddRow(): boolean {
    if (this._componentValue.status && ['3', '4'].includes(this._componentValue.status.value)) {
      return false;
    }
    // tslint:disable-next-line: no-string-literal
    if (this._componentValue.id && this._componentValue['editType'] !== 'entry') {
      return false;
    }
    const bool = this.isSingleStudentType(this._componentValue.productType);
    if (this._componentValue && bool
      && this._componentValue.relativeEntries && this._componentValue.relativeEntries.length > 0) {
      return false;
    }
    return true;
  }
  public setScheduleTeacher(model: RelativeEntity) {
    const param = {
      school_id: model.relativeSchool.id,
      student_id: model.student ? model.student.id : '',
      product_id: this._componentValue.product.id
    }
    this.studentBoughtSubjectService.getList(param).subscribe(
      (studentBoughtSubject: StudentBoughtSubject[]) => {
        if (studentBoughtSubject && studentBoughtSubject.length > 0) {
          const subject = studentBoughtSubject.find( (item) => item.id === this._componentValue.subject.id);
          if (subject && subject.relativeTeacher) {
            this._componentValue.teacher = subject.relativeTeacher;
            this.availableRelativeEntriesSubject.next(this._componentValue);
          }
        }
      }
    );
  }
  public judgeDetailInfo() {
    // tslint:disable-next-line: no-string-literal
    return this._componentValue['editType'] !== 'detail';
  }
  /**
   * 判断当前排课类型是否存在数组中
   * @param productType 需要验证的type， selectOptions 类型数组
   */
  private _judgeProductTypeContrain(productType: SelectOption, selectOptions: SelectOption[]) {
    if (productType && selectOptions && selectOptions.length > 0) {
      for (const item of selectOptions) {
        if (item.value === productType.value) {
          return true;
        }
      }
    }
    return false;
  }
  public isDemoType(productType: SelectOption) {
    return this._judgeProductTypeContrain(productType, this.productService.getDemoProductTypes());
  }
  public isVipClassType(productType: SelectOption) {
    return this._judgeProductTypeContrain(productType, this.productService.getVipClassProductTypes());
  }
  public isMultiStudentType(productType: SelectOption) {
    return this._judgeProductTypeContrain(productType, this.productService.getMultiStudentProductTypes());
  }
  public isSingleStudentType(productType: SelectOption) {
    return this._judgeProductTypeContrain(productType, this.productService.getSingleStudentProductTypes());
  }

  public getEntryType(index): SelectOption {
    return this.relativeEntityService.getEntryType(index);
  }
}
