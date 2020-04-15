import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService } from '@uni/core';
import { StudentCcFollows } from '../../models/student-follows.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
@Injectable({ providedIn: 'root' })
export class StudentCcFollowsEditService extends BaseService<StudentCcFollows>  {
    protected resourceUri = 'students/{student_id}/cc_follow';
    protected resourceName = 'cc_follow';

    protected rules = {
        id: { label: '跟进添加主键', columnType: NgxExcelColumnType.PrimaryKey },
        nextTime: {
            label: '下次跟进时间',
            columnType: NgxExcelColumnType.DateTime,
            prop: 'next_time'
        },
        remark: {
            label: '跟进内容',
            columnType: NgxExcelColumnType.Text
        },
        attachments: {
            label: '录音上传', columnType: NgxExcelColumnType.MultiUploadFile,
            acceptedFileType: '.mpeg,.mp3,.mpga,.wav,', acceptedFileCount: 2,
            prop: 'files'
        },
    } as NgxExcelModelColumnRules<StudentCcFollows>;


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
    ) {
        super(httpClient, backendService);
    }
}
