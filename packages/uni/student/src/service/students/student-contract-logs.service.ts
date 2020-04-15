import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BaseService, SchoolService, BackendService, ProductSubjectService} from '@uni/core';
import {NgxExcelColumnType, NgxExcelModelColumnRules} from 'ngx-excel';
import {StudentContractLog} from '../../models/student-contract-log';
import {Enums} from '../enums';
import {StudentContractService} from './student-contract.service';
@Injectable({providedIn: 'root'})
export class StudentContractLogsService extends  BaseService<StudentContractLog> {
  protected resourceUri = 'campuses/{school_id}/students/{student_id}/contract_logs';
  protected resourceName = 'contract_logs';
  protected rules = {
    id: {
      label: '记录ID', columnType: NgxExcelColumnType.PrimaryKey,
    },
    type: {
      label: '行为', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.StudentContractLog.RecordType)
    },
    studentId: {
      label: '学员ID', columnType: NgxExcelColumnType.Text,
    },
    contractId: {
      label: '合同ID', columnType: NgxExcelColumnType.Text,
    },
    contract: {
      label: '合同', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.studentContractService,
    },
    schoolId: {
      label: '校区ID', columnType: NgxExcelColumnType.Text, prop: 'campus_id',
    },
    amount: {
      label: '合同金额', columnType: NgxExcelColumnType.Text,
    },
    actualReceivedAmount: {
      label: '实收金额', columnType: NgxExcelColumnType.Text, prop: 'receivable_amount',
    },
    refundableAmount: {
      label: '应退金额', columnType: NgxExcelColumnType.Text, prop: 'refund_amount',
    },
    actualRefundAmount: {
      label: '实退金额', columnType: NgxExcelColumnType.Text, prop: 'refund_receive_amount',
    },
    excessAmount: {
      label: '超额支付', columnType: NgxExcelColumnType.Text, prop: 'excess_amount',
    },
    oldSchool: {
      label: '转校前校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService, prop: 'old_campus'
    },
    newSchool: {
      label: '转校后校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService, prop: 'new_campus'
    },
    oldSubjects: {
      label: '换前科目列表', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.subjectService, prop: 'old_subjects'
    },
    newSubjects: {
      label: '换后科目列表', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.subjectService, prop: 'new_subjects'
    },
    productType: {
      label: '产品类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.StudentContractLog.RecordType),
      resolveValue: (o: any, model: StudentContractLog) => this.resolveProductType(model)
    },
    status: {
      label: '状态', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.StudentContractLog.RecordType)
    },
    createdAt: {
      label: '创建时间', columnType: NgxExcelColumnType.DateTime, prop: 'created_at'
    },
    updatedAt: {
      label: '修改时间', columnType: NgxExcelColumnType.DateTime, prop: 'updated_at'
    }
  } as NgxExcelModelColumnRules<StudentContractLog>;
  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService,
    protected subjectService: ProductSubjectService,
    protected studentContractService: StudentContractService,
  ) {
    super(httpClient, backendService);
  }

  protected resolveProductType(model: StudentContractLog) {
    if (model && model.newSubjects && model.newSubjects.length > 0 && model.newSubjects[0].relativeProduct) {
      return model.newSubjects[0].relativeProduct.type;
    }
    return null;
  }
}
