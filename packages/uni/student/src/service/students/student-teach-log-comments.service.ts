import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService } from '@uni/core';
import { StudentTeacherLogComment } from '../../models/student-teach-logs.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
@Injectable({ providedIn: 'root' })
export class StudentTeachLogCommentsService extends BaseService<StudentTeacherLogComment>  {
    protected resourceUri = 'comments';
    protected resourceName = 'comment';

    protected rules = {
        id: { label: '评论主键', columnType: NgxExcelColumnType.PrimaryKey },
        englishName: {
            label: '#',
            columnType: NgxExcelColumnType.Text,
            prop: 'staff.english_name'
        },
        fullName: {
            label: '#',
            columnType: NgxExcelColumnType.Text,
            prop: 'staff.full_name'
        },
        content: {
            label: '#',
            columnType: NgxExcelColumnType.Text,
        },
        createdTime: {
            label: '#',
            columnType: NgxExcelColumnType.DateTime,
            prop: 'created_at'
        },
        oldName: {
            label: '附件',
            columnType: NgxExcelColumnType.Text,
            prop: '_embedded.document.old_name'
        },
        file_url: {
            label: '#',
            columnType: NgxExcelColumnType.Text,
            prop: '_embedded.document.file_url'
        },
        remark: {
            label: '我要评论',
            columnType: NgxExcelColumnType.Text
        },
        attachments: {
            label: '附件上传', columnType: NgxExcelColumnType.MultiUploadFile,
            acceptedFileCount: 4,
            prop: 'files'
        },
    } as NgxExcelModelColumnRules<StudentTeacherLogComment>;


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
    ) {
        super(httpClient, backendService);
    }
}
