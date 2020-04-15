import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService } from '@uni/core';
import { StudentFeedback } from '../../models/student-feedbacks.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { Enums } from '../enums';
@Injectable({ providedIn: 'root' })
export class StudentFeedBackService extends BaseService<StudentFeedback>  {
    protected resourceUri = 'students/{student_id}/feedbacks';
    protected resourceName = 'feedBack';

    protected rules = {
        id: { label: '学员反馈主键', columnType: NgxExcelColumnType.PrimaryKey },
        type: {
            label: '课程类型',
            columnType: NgxExcelColumnType.SelectOption,
            selectOptions: this.getSelectOptions(Enums.StudentFeedBack.FeedBack),
            prop: 'curriculum_type'
        },
        content: {
            label: '反馈内容',
            columnType: NgxExcelColumnType.MultilineText,
            prop: 'content'
        }
    } as NgxExcelModelColumnRules<StudentFeedback>;


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
    ) {
        super(httpClient, backendService);
    }
}
