import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService, SchoolService, StudentService } from '@uni/core';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { StudentTransferSchool } from '../../models/student-transfer-school.model';

@Injectable({ providedIn: 'root' })

export class StudentChangeSchoolEditService extends BaseService<StudentTransferSchool>  {
    protected resourceUri = 'students/{student}/transfer_school_records';
    protected resourceName = '';

    protected rules = {
        id: { label: '转校主键', columnType: NgxExcelColumnType.PrimaryKey },
        campus: {
            label: '转出校区', columnType: NgxExcelColumnType.Text
        },
        student: {
            label: '关联的学员', columnType: NgxExcelColumnType.ForeignKey,
            relativeService: this.studentService, labelKey: 'name',
            prop: 'student'
        },
        intoCmpus: {
            label: '转入校区', columnType: NgxExcelColumnType.ForeignKey,
            relativeService: this.schoolService, labelKey: 'name',
            prop: 'campus'
        },
        expiredProduct: {
            label: '存在过期产品',
            columnType: NgxExcelColumnType.Bool,
        },
        balance: {
            label: '存在欠款',
            columnType: NgxExcelColumnType.Bool,
        },
        number: {
            label: '钉钉审批编号',
            columnType: NgxExcelColumnType.Text,
        },
        remark: {
            label: '申请备注',
            columnType: NgxExcelColumnType.MultilineText,
        },
    } as NgxExcelModelColumnRules<StudentTransferSchool>;


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
        protected schoolService: SchoolService,
        protected studentService: StudentService
    ) {
        super(httpClient, backendService);
    }
}
