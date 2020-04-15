import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService } from '@uni/core';
import { StudentComplainFollow } from '../../models/student-complain.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { Enums } from '../enums';

@Injectable({ providedIn: 'root' })
export class StudentComplainFollowsService extends BaseService<StudentComplainFollow>  {

    protected resourceUri = 'student_complaints/{student_id}/follows';
    protected resourceName = 'student_complaint_follows';

    protected rules = {
        id: { label: '学员投诉跟进纪录主键', columnType: NgxExcelColumnType.PrimaryKey },
        hanbdleData: {
            label: '处理日期',
            columnType: NgxExcelColumnType.Text,
            prop: 'follow_date'
        },
        status: {
            label: '投诉状态',
            columnType: NgxExcelColumnType.SelectOption,
            selectOptions: this.getSelectOptions(Enums.StudentComplain.ComplaintsState),
            prop: 'folllow_status'
        },
        remark: {
            label: '备注',
            columnType: NgxExcelColumnType.MultilineText,
            prop: 'description'
        },
        manage: {
            label: '负责人',
            columnType: NgxExcelColumnType.Text,
            prop: 'manage.full_name'
        }
    } as NgxExcelModelColumnRules<StudentComplainFollow>;


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService
    ) {
        super(httpClient, backendService);
    }

    public getTypes() {
        return this.getSelectOptions(Enums.StudentComplain.ComplaintsAddState);
    }
}
