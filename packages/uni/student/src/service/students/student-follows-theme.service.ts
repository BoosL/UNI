import { Injectable } from '@angular/core';
import { BaseService } from '@uni/core';
import { StudentFollowsTheme } from '../../models/student-follows.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';



@Injectable({ providedIn: 'root' })
export class StudentFollowsThemeService extends BaseService<StudentFollowsTheme> {
    protected resourceUri = 'follows/sc_follow_title';
    protected resourceName = 'sc_follow_title';

    protected rules = {
        type: { label: '类型', columnType: NgxExcelColumnType.Number, prop: 'type' },
        title: { label: '主题名', columnType: NgxExcelColumnType.Text, prop: 'title' }
    } as NgxExcelModelColumnRules<StudentFollowsTheme>;
}
