import {Injectable} from '@angular/core';
import {NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService} from 'ngx-excel';
import {HttpClient} from '@angular/common/http';
import {
  BaseService,
  BackendService,
  School,
  Employee,
  SchoolService,
  EmployeeCcService
} from '@uni/core';
import {Enums} from './enums';
import {MarketingCustomer} from '../models/marketing-customer.model';
import {CustomerVisitedRecord} from '../models/customer-visited-record.model';
import {MarketingCustomerService} from './marketing-customer/marketing-customer';
import {of} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerVisitedRecordService extends BaseService<CustomerVisitedRecord> {

  protected resourceUri = 'v2/customer/visitings';
  protected resourceName = 'visitings';

  protected rules = {
    id: {
      label: '记录主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    school: {
      label: '到访校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService as NgxExcelService<School>, labelKey: 'name', prop: 'campus'
    },
    visitedTime: {
      label: '到访时间', columnType: NgxExcelColumnType.DateTime, prop: 'visited_at'
    },
    leaveTime: {
      label: '离校时间', columnType: NgxExcelColumnType.DateTime, prop: 'leaved_at', optional: true
    },
    visitorCount: {
      label: '到访人数', columnType: NgxExcelColumnType.Number, prop: 'visitors'
    },
    consultingDuration: {
      label: '咨询时长', columnType: NgxExcelColumnType.Number, prop: 'consult_durations', optional: true
    },
    consultingStatus: {
      label: '咨询状态', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getAllConsultingStatus(), prop: 'consult_status'
    },
    cc: {
      label: '分配CC', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeCcService as NgxExcelService<Employee>, labelKey: 'name', typeaheadKey: 'keyword'
    },
    relativeMarketingCustomer: {
      label: '关联的客户', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerService as NgxExcelService<MarketingCustomer>, labelKey: 'name'
    },
    remark: {
      label: '到访备注', columnType: NgxExcelColumnType.MultilineText
    },
    visitType: {
      label: '来访类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Customer.VisitType),
      prop: 'visit_type'
    }
  } as NgxExcelModelColumnRules<CustomerVisitedRecord>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService,
    protected employeeCcService: EmployeeCcService,
    protected customerService: MarketingCustomerService
  ) {
    super(httpClient, backendService);
  }

  /**
   * 获得所有的到访咨询状态
   */
  public getAllConsultingStatus() {
    return this.getSelectOptions(Enums.CustomerVisitedRecord.CCConsultStatus);
  }

  public getCcForeignModels(model: CustomerVisitedRecord, keyword: string) {
    if (!model.relativeMarketingCustomer || !model.relativeMarketingCustomer.school) {
      return of([]);
    }
    const filters = {
      schoolId: model.relativeMarketingCustomer.school.id,
      keyword
    };
    return this.employeeCcService.getList(filters, 1, 20);
  }

}
