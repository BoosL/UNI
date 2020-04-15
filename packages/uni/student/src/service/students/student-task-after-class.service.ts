import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService } from '@uni/core';
import { StudentTaskAfterClass } from '../../models/student-task-after-class.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { Enums } from '../enums';

@Injectable({ providedIn: 'root' })
export class StudentTaskAfterClassService extends BaseService<StudentTaskAfterClass>  {
    protected resourceUri = 'students/{student_id}/ac_tasks';
    protected resourceName = 'ac_tasks';

    protected rules = {
        id: { label: '课下任务主键', columnType: NgxExcelColumnType.PrimaryKey },
        actId: { label: '课下任务路由', columnType: NgxExcelColumnType.PrimaryKey },
        task: {
            label: '任务',
            columnType: NgxExcelColumnType.MultilineText,
            prop: 'task'
        },
        time: {
            label: '任务时间',
            columnType: NgxExcelColumnType.DateTime,
            prop: 'time'
        },
        status: {
            label: '完成情况',
            columnType: NgxExcelColumnType.SelectOption,
            selectOptions: this.getSelectOptions(Enums.StudentTaskAfterClass.TaskAfterClassStatus)
        },
        remark: {
            label: '批改意见',
            columnType: NgxExcelColumnType.MultilineText,
            prop: 'correction_opinion'
        },
        createdTime: {
            label: '创建时间',
            columnType: NgxExcelColumnType.DateTime,
            prop: 'created_at'
        }
    } as NgxExcelModelColumnRules<StudentTaskAfterClass>;


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
    ) {
        super(httpClient, backendService);
    }
}
