import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService, StudentService } from '@uni/core';
import { StudentScFollows } from '../../models/student-follows.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { StudentFollowsThemeService } from './student-follows-theme.service';

@Injectable({ providedIn: 'root' })
export class StudentFollowsEditService extends BaseService<StudentScFollows>  {
    protected resourceUri = 'students/{student_id}/ai_follow';
    protected resourceName = 'ai_follow';

    protected rules = {
        id: { label: '跟进添加主键', columnType: NgxExcelColumnType.PrimaryKey },
        relativeStudent: {
            label: '关联的学员', columnType: NgxExcelColumnType.ForeignKey,
            relativeService: this.studentService, labelKey: 'name',
            prop: 'student'
        },
        theme: {
            label: '主题', columnType: NgxExcelColumnType.ForeignKey,
            relativeService: this.studentFollowsThemeService,
            labelKey: 'title', typeaheadKey: 'keyword',
            prop: 'sc_follow_title'
        },
        nextTime: {
            label: '下次跟进时间',
            columnType: NgxExcelColumnType.DateTime,
            prop: 'next_time'
        },
        remark: {
            label: '跟进内容',
            columnType: NgxExcelColumnType.Text
        }
    } as NgxExcelModelColumnRules<StudentScFollows>;


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
        protected studentFollowsThemeService: StudentFollowsThemeService,
        protected studentService: StudentService,
    ) {
        super(httpClient, backendService);
    }

    /**
     * 获得添加学员SC跟进记主题可选项列表
     * @param model 模型
     * @param keyword 查询关键字
     */
    public getThemeForeignModels(model, keyword?: string) {
        const filters: { student_id: string, keyword?: string } = { student_id: model.relativeStudent };
        if (keyword) {
            filters.keyword = keyword || '';
        }
        return this.studentFollowsThemeService.getList(filters);
    }
}
