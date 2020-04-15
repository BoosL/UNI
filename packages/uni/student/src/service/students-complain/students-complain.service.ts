import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService } from '@uni/core';
import { StudentComplain } from '../../models/student-complain.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { Enums } from '../enums';

@Injectable({ providedIn: 'root' })
export class StudentComplainService extends BaseService<StudentComplain>  {

    protected resourceUri = 'student_complaints';
    protected resourceName = 'student_complaint';

    protected rules = {
        id: { label: '学员投诉主键', columnType: NgxExcelColumnType.PrimaryKey },
        theme: {
            label: '主题',
            columnType: NgxExcelColumnType.Text,
            prop: 'theme'
        },
        student: {
            label: '学员',
            columnType: NgxExcelColumnType.Text,
            prop: 'student.full_name'
        },
        complaintDate: {
            label: '投诉日期',
            columnType: NgxExcelColumnType.Text,
            prop: 'complaint_date'
        },
        complaintsType: {
            label: '投诉类型',
            columnType: NgxExcelColumnType.SelectOption,
            selectOptions: this.getSelectOptions(Enums.StudentComplain.ComplaintsType),
            prop: 'complaint_type'
        },
        byComplainant: {
            label: '被投诉人',
            columnType: NgxExcelColumnType.Text,
            prop: 'respondent.full_name'
        },
        followUpTime: {
            label: '最新跟进时间',
            columnType: NgxExcelColumnType.Text,
            prop: 'latest_date'
        },
        state: {
            label: '状态',
            columnType: NgxExcelColumnType.SelectOption,
            selectOptions: this.getSelectOptions(Enums.StudentComplain.ComplaintsState),
            prop: 'complaint_status'
        },
        manage: {
            label: '负责人',
            columnType: NgxExcelColumnType.Text,
            prop: 'manage.full_name'
        },
        campus: {
            label: '校区',
            columnType: NgxExcelColumnType.Text,
            prop: 'campus.campus_name'
        },
        remark: {
            label: '备注',
            columnType: NgxExcelColumnType.Text,
            prop: 'remark'
        }
    } as NgxExcelModelColumnRules<StudentComplain>;


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService
    ) {
        super(httpClient, backendService);
    }
}
