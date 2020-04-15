import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { Enums } from './enums';
import { ContractDeferredRecord } from '../models/contract-deferred-record.model';
import { BaseService, BackendService } from '@uni/core';
import { ContractDtoService } from './contract-dto.service';
import {ContractStudentService} from './contract-student.service';
import {ContractEmployeeService} from './contract-employee.service';

@Injectable({providedIn: 'root'})
export class ContractDeferredRecordService extends BaseService<ContractDeferredRecord> {

  protected resourceUri = 'students/{student_id}/contracts/{contract_id}/delays';
  protected resourceName = 'delays';

  protected rules = {
    id: { label: '延期记录主键', columnType: NgxExcelColumnType.PrimaryKey },
    type: {
      label: '延期类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.ContractDeferredRecord.Type),
      prop: 'delay_type'
    },
    productEndTime: {
      label: '结束时间', columnType: NgxExcelColumnType.Date,
      prop: 'product_expired_at'
    },
    month: {
      label: '延期时长', columnType: NgxExcelColumnType.Number,
      prop: 'delay_month'
    },
    startTime: {
      label: '开始时间', columnType: NgxExcelColumnType.Date,
      prop: 'start_at'
    },
    endTime: {
      label: '截止时间', columnType: NgxExcelColumnType.Date,
      prop: 'end_at'
    },
    fee: {
      label: '延期费用', columnType: NgxExcelColumnType.Currency,
      prop: 'delay_fee'
    },
    attachments: {
      label: '附件上传', columnType: NgxExcelColumnType.MultiUploadFile,
      acceptedFileType: '.jpg,.jpeg,.png,.bmp', acceptedFileSize: 1000, acceptedFileCount: 5,
      prop: 'files'
    },
    relativeStudent: {
      label: '关联的学员', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.studentService, labelKey: 'name',
      prop: 'student'
    },
    relativeEmployee: {
      label: '延期发起人', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService, labelKey: 'name',
      prop: 'staff'
    },
    relativeContract: {
      label: '关联的合同', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.studentContractService, labelKey: 'name',
      prop: 'contract'
    },
    createdTime: {
      label: '延期发起时间', columnType: NgxExcelColumnType.DateTime,
      prop: 'created_at'
    },
    effectedTime: {
      label: '延期生效时间', columnType: NgxExcelColumnType.DateTime,
      prop: 'success_at'
    },
    status: {
      label: '延期状态', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.ContractDeferredRecord.Status)
    },
    remark: {
      label: '备注', columnType: NgxExcelColumnType.MultilineText,
      prop: 'delay_reason', optional: true
    }
  } as NgxExcelModelColumnRules<ContractDeferredRecord>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected studentService: ContractStudentService,
    protected employeeService: ContractEmployeeService,
    protected studentContractService: ContractDtoService,
  ) {
    super(httpClient, backendService);
  }

  public getTypes() {
    return this.getSelectOptions(Enums.ContractDeferredRecord.Type);
  }

}
