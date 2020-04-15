import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService } from '@uni/core';
import { StudentFollows } from '../../models/student-follows.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { StudentFollowsThemeService } from './student-follows-theme.service';

@Injectable({ providedIn: 'root' })
export class StudentFollowsService extends BaseService<StudentFollows>  {
    protected resourceUri = 'follows';
    protected resourceName = 'followList';

    protected rules = {
        id: { label: '跟进主键', columnType: NgxExcelColumnType.PrimaryKey },
        name: {
            label: '主题',
            columnType: NgxExcelColumnType.Text,
            prop: 'data.title'
        },
        nextData: {
            label: '下次跟进日期',
            columnType: NgxExcelColumnType.Date,
            prop: 'next_time'
        },
        nextTime: {
            label: '下次跟进时间',
            columnType: NgxExcelColumnType.DateTime,
            prop: 'next_time'
        },
        record: {
            label: '跟进纪录',
            columnType: NgxExcelColumnType.MultilineText,
            prop: 'content'
        },
        followPerson: {
            label: '跟进人',
            columnType: NgxExcelColumnType.Text,
            prop: 'create_staff_name'
        },
        createData: {
            label: '创建日期',
            columnType: NgxExcelColumnType.Date,
            prop: 'created_at'
        },
        recording: {
            label: '录音',
            columnType: NgxExcelColumnType.Array,
            resolveValue: (o: any) => this.resolveRecording(o),
            prop: 'play_urls'
        },
        school: {
            label: '校区',
            columnType: NgxExcelColumnType.Text,
            prop: 'campus_name'
        },
        remark: {
            label: '跟进内容',
            columnType: NgxExcelColumnType.Text
        }
    } as NgxExcelModelColumnRules<StudentFollows>;


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
        protected studentFollowsThemeService: StudentFollowsThemeService,
    ) {
        super(httpClient, backendService);
    }

    protected resolveRecording(o: any) {
        const playUrls = o.play_urls;
        const recordingArr = [];
        for (const item of playUrls) {
            const playUrl = item.play_url;
            recordingArr.push(playUrl);
        }
        return recordingArr;
    }
}
