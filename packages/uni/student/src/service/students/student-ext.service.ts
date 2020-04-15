import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelColumnType } from 'ngx-excel';
import { BaseStudentService, BackendService, SchoolService, EmployeeService, ProductService } from '@uni/core';
import { StudentExt, StudentEtpSeries } from '../../models/student-ext.model';
import { Enums } from '../enums';

@Injectable({ providedIn: 'root' })
export class StudentExtService extends BaseStudentService<StudentExt> {

  protected resourceUri = 'campuses/{school_id}/students';
  protected resourceName = 'students';

  protected additionalRules = {
    portrait: {
      label: '学员头像', columnType: NgxExcelColumnType.UploadFile,
      prop: 'head_portrait'
    },
    gender: {
      label: '学员性别', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Common.Gender),
      prop: 'sex'
    },
    phone: { label: '联系电话', columnType: NgxExcelColumnType.Text },
    school: {
      label: '所属校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService, labelKey: 'name'
    },
    importanceType: {
      label: '重视程度', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Student.ImportanceType),
      optional: true
    },
    levelEtpStart: {
      label: 'Etp开始等级', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.productService.getEtpLevels(),
      prop: 'etp_start_level'
    },
    levelEtpEnd: {
      label: 'Etp结束等级', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.productService.getEtpLevels(),
      prop: 'etp_end_level'
    },
    levelEtpCurrent: {
      label: '当前Etp等级', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.productService.getEtpLevels(),
      prop: 'etp_level',
      optional: true
    },
    levelEtpPercent: {
      label: 'Etp等级完成度', columnType: NgxExcelColumnType.Number,
      resolveValue: (o: any, model: Partial<StudentExt>) => this.resolveLevelEtpPercent(o, model)
    },
    levelEtpSeries: {
      label: 'Etp序列', columnType: NgxExcelColumnType.Array,
      resolveValue: (o: any, model: Partial<StudentExt>) => this.resolveLevelEtpSeries(o, model)
    },
    sc: {
      label: '已分配SC', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService, labelKey: 'name', typeaheadKey: 'name',
      optional: true
    },
    cc: {
      label: '已分配CC', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService, labelKey: 'name', typeaheadKey: 'name',
      optional: true
    },
    tutor: {
      label: '已分配Tutor', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService, labelKey: 'name', typeaheadKey: 'name',
      optional: true
    },
    scFollow: {
      label: 'SC跟进主题', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Student.ScFollow),
      optional: true
    },
    curriculumBeginTime: {
      label: '学习开始时间', columnType: NgxExcelColumnType.Date,
      optional: true
    },
    curriculumEndTime: {
      label: '学习结束时间', columnType: NgxExcelColumnType.Date,
      optional: true
    },
    curriculumCount: {
      label: '剩余课时', columnType: NgxExcelColumnType.Number,
      optional: true
    },
    customerId: {
      label: '所属客户', columnType: NgxExcelColumnType.ForeignKey,
      prop: 'consumer_id',
      optional: true
    },
    firstContractedAt: {
      label: '录入时间', columnType: NgxExcelColumnType.DateRange,
      optional: true
    },
    status: {
      label: '学习状态', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Student.Status),
      optional: true
    },
    remark: {
      label: '备注', columnType: NgxExcelColumnType.MultilineText,
      prop: 'description', optional: true
    }
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected productService: ProductService,
    protected schoolService: SchoolService,
    protected employeeService: EmployeeService
  ) {
    super(httpClient, backendService);
  }

  protected resolveLevelEtpPercent(o: any, model: Partial<StudentExt>): number {
    const levelCurrent = model.levelEtpCurrent ? parseInt(model.levelEtpCurrent.value, 10) : 0;
    const levelStart = model.levelEtpStart ? parseInt(model.levelEtpStart.value, 10) : 0;
    const levelEnd = model.levelEtpEnd ? parseInt(model.levelEtpEnd.value, 10) : 0;
    if (!levelCurrent || !levelStart || !levelEnd) {
      return 0;
    }
    const purchasedCurriculumCount = o.etp_current_total_class_hours || 0;  // 当前级别购买的总课时数
    const remainedCurriculumCount = o.etp_no_attend_class_hour || 0;        // 当前级别剩余课时数

    let percent = 0;
    if (levelStart > levelEnd) {
      // 开始级别 > 结束级别? 需要复查数据问题
      percent = 100;
    } else {
      // 按级别数量分段计算
      percent = Math.floor(100 / (levelEnd - levelStart + 1) *
        (
          (levelCurrent - levelStart) +
          (!purchasedCurriculumCount ? 0 : (purchasedCurriculumCount - remainedCurriculumCount) / purchasedCurriculumCount)
        )
      );
    }
    return percent;
  }

  protected resolveLevelEtpSeries(o: any, model: Partial<StudentExt>): Array<StudentEtpSeries> {
    const series: Array<StudentEtpSeries> = [];
    if (!model.levelEtpStart || !model.levelEtpEnd || !model.levelEtpCurrent) { return series; }
    let nextStatus: 'invailable-lower' | 'available' | 'invailable-higher' = null;
    this.productService.getEtpLevels().forEach((level) => {
      const seriesItem = Object.assign({}, level) as StudentEtpSeries;
      switch (nextStatus) {
        case 'available':
          if (level.value === model.levelEtpEnd.value) {
            seriesItem.status = 'available';
            seriesItem.isEnd = true;
            nextStatus = 'invailable-higher';
          } else {
            seriesItem.status = 'available';
            nextStatus = 'available';
          }
          break;
        case 'invailable-higher':
          seriesItem.status = 'inavailable-higher';
          nextStatus = 'invailable-higher';
          break;
        default:
          if (level.value === model.levelEtpStart.value) {
            seriesItem.status = 'available';
            seriesItem.isStart = true;
            nextStatus = 'available';
          } else {
            seriesItem.status = 'invailable-lower';
            nextStatus = 'invailable-lower';
          }
      }
      seriesItem.isCurrent = seriesItem.value === model.levelEtpCurrent.value;
      if (seriesItem.status === 'available') {

      } else {
        seriesItem.percent = 0;
      }
    });
    return series;
  }

}
