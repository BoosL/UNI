import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService } from '@uni/core';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { StudentSubjects } from '../../../../models/student-achievements.model';


@Injectable({ providedIn: 'root' })
export class StudentAchievementSubentryService extends BaseService<StudentSubjects> {
    protected resourceUri = '';
    protected resourceName = '';

    protected rules = {
        id: { label: '#', columnType: NgxExcelColumnType.PrimaryKey },
        name: { label: '分项名称', columnType: NgxExcelColumnType.Text },
        fraction: { label: '分数', columnType: NgxExcelColumnType.Text },
        remark: { label: '分项备注', columnType: NgxExcelColumnType.Text },
    } as NgxExcelModelColumnRules<StudentSubjects>;


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
    ) {
        super(httpClient, backendService);
    }
}
