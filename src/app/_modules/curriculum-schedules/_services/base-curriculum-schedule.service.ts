import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService} from 'ngx-excel';
import {
  BackendService,
  BaseService,
  ClassroomService,
  EmployeeService, ProductCurriculumService, ProductService, ProductSubjectService,
  SchoolService, SelectOption, TeacherService, CurriculumPackageService,
  Classroom, School, CurriculumPackage, Employee, ProductSubject, ProductCurriculum, Product
} from '@uni/core';
import {Enums} from '../../_enums';
import {BaseCurriculumSchedule, RelativeEntity} from '../models/curriculum-schedule.model';
import {RelativeEntryService} from './relative-entry.service';

@Injectable()
export abstract class BaseCurriculumScheduleService<T extends BaseCurriculumSchedule> extends BaseService<T> {

  protected resourceUri = '';
  protected resourceName = '';
  protected rules = {
    id: { label: '排课id', columnType: NgxExcelColumnType.PrimaryKey },
    time: { label: '排课时间', columnType: NgxExcelColumnType.Text },
    classroom: {
      label: '上课教室',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.classroomService as NgxExcelService<Classroom>,
      labelKey: 'name',
      optional: true
    },
    school: {
      label: '上课校区',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService as NgxExcelService<School>,
      prop: 'campus',
      labelKey: 'name'
    },
    package: {
      label: '课件包',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.packageService as NgxExcelService<CurriculumPackage>,
      labelKey: 'name',
      typeaheadKey: 'keyword',
      optional: true
    },
    status: {
      label: '状态',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CurriculumSchedule.CurriculumScheduleStatus)
    },
    teachingType: {
      label: '授课方式',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CurriculumSchedule.CType)
    },
    meetingName: { label: '会议名称', columnType: NgxExcelColumnType.Text, optional: true },
    meetingNumber: { label: '会议编号', columnType: NgxExcelColumnType.Text, optional: true },
    meetingAccount: { label: '会议账号', columnType: NgxExcelColumnType.Text, optional: true },
    score: { label: '上课得分', columnType: NgxExcelColumnType.Text },
    remark: { label: '备注', columnType: NgxExcelColumnType.MultilineText, optional: true },
    teacher: {
      label: '授课教师',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.teacherService as NgxExcelService<Employee>,
      labelKey: 'name',
      typeaheadKey: 'keyword'
    },
    curriculum: {
      label: '课程信息',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.curriculumService as NgxExcelService<ProductCurriculum>,
      labelKey: 'name',
      typeaheadKey: 'keyword'
    },
    creator: {
      label: '创建人', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService as NgxExcelService<Employee>,
      labelKey: 'name',
    },
    createdAt: { label: '创建时间', columnType: NgxExcelColumnType.DateTime },
    productType: {
      label: '排课类型',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CurriculumSchedule.ProductType),
      resolveValue: (o: any, model: BaseCurriculumSchedule) => this.resolveProductType(model)
    },
    product: {
      label: '排课产品',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.productService as NgxExcelService<Product>,
      labelKey: 'name',
      typeaheadKey: 'keyword',
      resolveValue: (o: any, model: BaseCurriculumSchedule) => this.resolveProduct(model)
    },
    subject: {
      label: '科目列表',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.subjectService as NgxExcelService<ProductSubject>,
      labelKey: 'name',
      typeaheadKey: 'keyword',
      resolveValue: (o: any, model: BaseCurriculumSchedule) => this.resolveSubject(model)
    },
    relativeEntries: {
      label: '上课名单',
      columnType: NgxExcelColumnType.MultiForeignKey,
      relativeService: this.relativeEntriesService as NgxExcelService<RelativeEntity>,
      resolveValue: (o: any, model: BaseCurriculumSchedule) => this.resolveRelativeEntries(o, model)
    }
  } as NgxExcelModelColumnRules<T>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService,
    protected classroomService: ClassroomService,
    protected teacherService: TeacherService,
    protected packageService: CurriculumPackageService,
    protected employeeService: EmployeeService,
    protected productService: ProductService,
    protected subjectService: ProductSubjectService,
    protected curriculumService: ProductCurriculumService,
    protected relativeEntriesService: RelativeEntryService
  ) {
    super(httpClient, backendService);
  }

  protected resolveRelativeEntries(o: any, model: BaseCurriculumSchedule): RelativeEntity[] {
    if (o.relative_entries) {
      if (o.relative_entries.length > 0) {
        const list = [];
        for (const item of o.relative_entries) {
          const entry = this.relativeEntriesService.createModel(null, item);
          // tslint:disable: no-string-literal
          entry['scheduleId'] = model.id;
          entry['productType'] = model.productType;
          entry['curriculumId'] = model.curriculum.id;
          entry['scheduleStatus'] = model.status.value;
          list.push(entry);
        }
        return list;
      }
    }
    return o.relative_entries;
  }

  protected resolveProductType(model: BaseCurriculumSchedule) {
    if (model && model.curriculum && model.curriculum.relativeProduct) {
      return model.curriculum.relativeProduct.type;
    }
    return null;
  }

  protected resolveProduct(model: BaseCurriculumSchedule) {
    if (model && model.curriculum && model.curriculum.relativeProduct) {
      return model.curriculum.relativeProduct;
    }
    return null;
  }

  protected resolveSubject(model: BaseCurriculumSchedule) {
    if (model && model.curriculum && model.curriculum.relativeSubject) {
      return model.curriculum.relativeSubject;
    }
    return null;
  }

}
