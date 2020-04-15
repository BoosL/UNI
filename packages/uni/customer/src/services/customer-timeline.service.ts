import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import { BaseService, BackendService, EmployeeService, Employee } from '@uni/core';
import {CustomerVisitedRecordService} from './customer-visited-record.service';
import {MarketingCustomerService} from './marketing-customer/marketing-customer.service';
import {CustomerConsultingRecordService} from './customer-consulting-record.service';
import {CustomerFollowRecordService} from './customer-follow-record.service';
import { CustomerTimeline } from '../models/customer-timeline.model';
import { CustomerCompatibleFollowRecordService } from './customer-compatible-follow-record.service';
import { CustomerReservedRecordService } from './customer-reserved-record.service';

@Injectable({ providedIn: 'root' })
export class CustomerTimelineService extends BaseService<CustomerTimeline> {

  protected resourceUri = 'v2/customer/customers/{customer_id}/events';
  protected resourceName = 'customer_event_logs';

  protected rules = {
    id: {
      label: '记录主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    type: {
      label: '记录类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions('CUSTOMER_EVENT_LOG_TYPE')
    },
    relativeEmployee: {
      label: '关联的操作人', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService as NgxExcelService<Employee>, labelKey: 'name',
      prop: 'staff'
    },
    note: {
      label: '记录说明', columnType: NgxExcelColumnType.Text, optional: true
    },
    createdTime: {
      label: '发生时间', columnType: NgxExcelColumnType.DateTime, prop: 'created_at'
    },
    relativeCustomer: {
      label: '客户信息', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: null, labelKey: 'id',
      resolveValue: (o: any, model: Partial<CustomerTimeline>) => this.resolveRelativeCustomer(o, model)
    },
    tmkFollowRecord: {
      label: 'TMK跟进记录', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: null, labelKey: 'id',
      resolveValue: (o: any, model: Partial<CustomerTimeline>) => this.resolveCompatibleFollowRecord('tmk_followed', o, model)
    },
    tmkReservedRecord: {
      label: 'TMK预约到访', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: null, labelKey: 'id',
      resolveValue: (o: any, model: Partial<CustomerTimeline>) => this.resolveReservedRecord('tmk_reserved', o, model)
    },
    tmkTransferredRecord: {
      label: 'TMK流转', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: null, labelKey: 'id',
      resolveValue: (o: any, model: Partial<CustomerTimeline>) => this.resolveEmployeeTransferredRecord('tmk_transferred', o, model)
    },
    ccFollowRecord: {
      label: 'CC跟进记录', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: null, labelKey: 'id',
      resolveValue: (o: any, model: Partial<CustomerTimeline>) => this.resolveFollowRecord(o, model)
    },
    ccReservedRecord: {
      label: 'CC预约到访', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: null, labelKey: 'id',
      resolveValue: (o: any, model: Partial<CustomerTimeline>) => this.resolveReservedRecord('cc_reserved', o, model)
    },
    ccConsultingRecord: {
      label: 'CC咨询记录', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: null, labelKey: 'id',
      resolveValue: (o: any, model: Partial<CustomerTimeline>) => this.resolveConsultingRecord(o, model)
    },
    ccTransferredRecord: {
      label: 'CC流转', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: null, labelKey: 'id',
      resolveValue: (o: any, model: Partial<CustomerTimeline>) => this.resolveEmployeeTransferredRecord('cc_transferred', o, model)
    },
    usVisitedRecord: {
      label: '客户到访记录', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: null, labelKey: 'id',
      resolveValue: (o: any, model: Partial<CustomerTimeline>) => this.resolveVisitedRecord(o, model)
    },
    scTransferredRecord: {
      label: 'SC流转', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: null, labelKey: 'id',
      resolveValue: (o: any, model: Partial<CustomerTimeline>) => this.resolveEmployeeTransferredRecord('sc_transferred', o, model)
    },
    schoolTransferredRecord: {
      label: '客户校区变更记录', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: null, labelKey: 'id'
    }
  } as NgxExcelModelColumnRules<CustomerTimeline>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected employeeService: EmployeeService,
    protected customerService: MarketingCustomerService,
    protected customerFollowRecordService: CustomerFollowRecordService,
    protected customerReservedRecordService: CustomerReservedRecordService,
    protected customerVisitedRecordService: CustomerVisitedRecordService,
    protected customerConsultingRecordService: CustomerConsultingRecordService,
    protected customerCompatibleFollowRecordService: CustomerCompatibleFollowRecordService
  ) {
    super(httpClient, backendService);
  }

  protected resolveRelativeCustomer(o: any, model: Partial<CustomerTimeline>) {
    return model.type.value === 'customer_add' ? this.customerService.createModel(null, o.detail) : null;
  }

  protected resolveEmployeeTransferredRecord(name: string, o: any, model: Partial<CustomerTimeline>) {
    return model.type.value === name ? this.employeeService.createModel(null, o.detail) : null;
  }

  protected resolveReservedRecord(name: string, o: any, model: Partial<CustomerTimeline>) {
    return model.type.value === name ? this.customerReservedRecordService.createModel(null, o.detail) : null;
  }

  protected resolveFollowRecord(o: any, model: Partial<CustomerTimeline>) {
    return model.type.value === 'cc_followed' ? this.customerFollowRecordService.createModel(null, o.detail) : null;
  }

  protected resolveConsultingRecord(o: any, model: Partial<CustomerTimeline>) {
    return model.type.value === 'cc_consult' ? this.customerConsultingRecordService.createModel(null, o.detail) : null;
  }

  protected resolveCompatibleFollowRecord(name: string, o: any, model: Partial<CustomerTimeline>) {
    return model.type.value === name ? this.customerCompatibleFollowRecordService.createModel(null, o.detail) : null;
    /* if (name === 'tmk') {
      if (['tmk_followed', 'tmk_reserved'].indexOf(model.type.value) < 0) { return null; }
      return this.customerCompatibleFollowRecordService.createModel(null, o.detail);
    } else if (name === 'sc') {
      return ['sc_followed'].indexOf(model.type.value) < 0 ?
        null : this.customerCompatibleFollowRecordService.createModel(null, o.detail);
    } else if (name === 'usher') {
      return ['usher_followed'].indexOf(model.type.value) < 0 ?
        null : this.customerCompatibleFollowRecordService.createModel(null, o.detail);
    }
    return null; */
  }

  protected resolveVisitedRecord(o: any, model: Partial<CustomerTimeline>) {
    return model.type.value === 'visited' ? this.customerVisitedRecordService.createModel(null, o.detail) : null;
  }

}
