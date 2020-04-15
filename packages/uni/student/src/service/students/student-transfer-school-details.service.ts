import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService, SchoolService } from '@uni/core';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { StudentTransferSchoolDetails } from '../../models/student-transfer-school.model';

@Injectable({ providedIn: 'root' })

export class StudentChangeSchoolDetailsService extends BaseService<StudentTransferSchoolDetails>  {
    protected resourceUri = 'students/{student}/transfer_school_records/_current';
    protected resourceName = '';

    protected rules = {
        id: { label: '转校合同主键', columnType: NgxExcelColumnType.PrimaryKey },
        outContractAmount: {
            label: '转出合同金额',
            columnType: NgxExcelColumnType.Text,
            prop: 'old_contract_amount'
        },
        intocContractAmount: {
            label: '转入校区合同金额',
            columnType: NgxExcelColumnType.Text,
            prop: 'new_contract_amount'
        },
        diffAmount: {
            label: '转校差价',
            columnType: NgxExcelColumnType.Text,
            prop: 'diff_amount'
        },
        customSpread: {
            label: '自定义差价',
            columnType: NgxExcelColumnType.Text
        }
    } as NgxExcelModelColumnRules<StudentTransferSchoolDetails>;


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
        protected schoolService: SchoolService
    ) {
        super(httpClient, backendService);
    }
}
