import { Injectable } from '@angular/core';
import { BaseService } from '@uni/core';
import { StudentAchievements } from '../../models/student-achievements.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { Enums } from '../enums';

@Injectable({ providedIn: 'root' })
export class StudentAchievementsService extends BaseService<StudentAchievements>  {
    protected resourceUri = 'students/{student_id}/achievements';
    protected resourceName = 'achievements';

    protected rules = {
        id: { label: '跟进添加主键', columnType: NgxExcelColumnType.PrimaryKey },
        type: {
            label: '考试类型',
            columnType: NgxExcelColumnType.SelectOption,
            selectOptions: this.getSelectOptions(Enums.StudentAchevement.AchievementType),
            optional: true
        },
        testDate: {
            label: '考试日期',
            columnType: NgxExcelColumnType.Date,
            prop: 'exam_date',
            optional: true
        },
        resultDate: {
            label: '成绩公布日期',
            columnType: NgxExcelColumnType.Date,
            prop: 'result_date',
            optional: true
        },
        totalPoints: {
            label: '总成绩',
            columnType: NgxExcelColumnType.Text,
            prop: 'total_score'
        },
        isProgressed: {
            label: '是否进步',
            columnType: NgxExcelColumnType.Bool,
            prop: 'is_progressed',
            optional: true
        },
        isQualified: {
            label: '是否达标',
            columnType: NgxExcelColumnType.Bool,
            prop: 'is_qualified',
            optional: true
        },
        subjects: {
            label: '分项',
            columnType: NgxExcelColumnType.Array,
            prop: 'subjects'
        },
        remark: { label: '备注', columnType: NgxExcelColumnType.Text },
    } as NgxExcelModelColumnRules<StudentAchievements>;
}
