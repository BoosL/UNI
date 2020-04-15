import { Injectable } from '@angular/core';
import { BaseService } from '@uni/core';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { Enums } from '../enums';
import { StudentAllocationDetail } from '../../models/student-allocation-detail.model';

@Injectable({ providedIn: 'root' })
export class StudentAlloctionDetailService extends BaseService<StudentAllocationDetail>  {
    protected resourceUri = 'students/{student_id}/allot_logs';
    protected resourceName = 'staff_allot_logs';

    protected rules = {
        id: {
            label: '学员分配明细主键',
            columnType: NgxExcelColumnType.PrimaryKey
        },
        time: {
            label: '分配时间',
            columnType: NgxExcelColumnType.DateTime,
            prop: 'created_at'
        },
        type: {
            label: '分配类型',
            columnType: NgxExcelColumnType.SelectOption,
            selectOptions: this.getSelectOptions(Enums.StudentAllocationDetail.AllocationDetail),
            prop: 'allot_type'
        },
        old: {
            label: '过去',
            columnType: NgxExcelColumnType.Text,
            prop: 'assigner.full_name'
        },
        new: {
            label: '现在',
            columnType: NgxExcelColumnType.Text,
            prop: 'manage.full_name'
        },
        operator: {
            label: '操作人',
            columnType: NgxExcelColumnType.Text,
            prop: 'allot_staff.full_name'
        },
    } as NgxExcelModelColumnRules<StudentAllocationDetail>;
}
