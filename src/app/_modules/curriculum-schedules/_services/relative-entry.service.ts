import {HttpClient} from '@angular/common/http';
import {BackendService, BaseService, SchoolService} from '@uni/core';
import {RelativeEntity} from '../models/curriculum-schedule.model';
import {NgxExcelColumnType, NgxExcelModelColumnRule} from 'ngx-excel';
import {CustomerService} from './customer.service';
import {Enums} from '../../_enums';
import {SmallClassService} from './small-class.service';
import {Injectable} from '@angular/core';
import {StudentExtService} from '@uni/student';

@Injectable({providedIn: 'root'})
export class RelativeEntryService extends BaseService<RelativeEntity> {
  protected resourceUri = '';
  protected resourceName = '';
  protected rules = {
    id: { label: '#', columnType: NgxExcelColumnType.PrimaryKey },
    type: {
      label: '实体类型',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CurriculumSchedule.Relations), prop: 'type'
    },
    score: { label: '学员评分', columnType: NgxExcelColumnType.Text },
    comment: { label: '学员评价', columnType: NgxExcelColumnType.Text, },
    student: {
      label: '课程学员',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.studentService,
      labelKey: 'name',
      typeaheadKey: 'keyword'
    },
    customer: {
      label: '课程客户',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerService,
      labelKey: 'name',
      typeaheadKey: 'keyword'
    },
    smallClass: {
      label: '课程小班',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.smallClassService,
      labelKey: 'name',
      typeaheadKey: 'keyword'
    },
    relativeSchool: {
      label: '关联校区',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService,
      resolveValue: (o: any, model: RelativeEntity) => this.resolveRelativeSchool(model),
      labelKey: 'name'
    }
  } as { [id in keyof RelativeEntity]: NgxExcelModelColumnRule<RelativeEntity> }

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected studentService: StudentExtService,
    protected customerService: CustomerService,
    protected schoolService: SchoolService,
    protected smallClassService: SmallClassService
  ) {
    super(httpClient, backendService);
  }

  protected resolveRelativeSchool(model: RelativeEntity) {
    if (model.student && model.student.school) {
      return this.schoolService.createModel(model.student.school);
    }
    if (model.customer && model.customer.school) {
      return this.schoolService.createModel(model.customer.school);
    }
    return null;
  }
  public getEntryType(index) {
    return this.getSelectOptions(Enums.CurriculumSchedule.Relations)[index];
  }
}
