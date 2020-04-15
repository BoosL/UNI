import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService } from '@uni/core';
import { StudentTeacherLog } from '../../models/student-teach-logs.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { Enums } from '../enums';

@Injectable({ providedIn: 'root' })
export class StudentTeacheLogsService extends BaseService<StudentTeacherLog>  {
    protected resourceUri = 'students/{student_id}/teach_logs';
    protected resourceName = 'teachLogs';

    protected rules = {
        id: { label: ' 教学日志主键', columnType: NgxExcelColumnType.PrimaryKey },
        name: {
            label: '排课名称',
            columnType: NgxExcelColumnType.Text,
            prop: 'curriculum_schedule.curriculum.name'
        },
        data: {
            label: '排课日期',
            columnType: NgxExcelColumnType.Text,
            prop: 'curriculum_schedule.course_time'
        },
        teacher: {
            label: '老师',
            columnType: NgxExcelColumnType.Text,
            prop: 'curriculum_schedule.teacher.full_name'
        },
        newLogTime: {
            label: '新增日志时间',
            columnType: NgxExcelColumnType.Text,
            prop: 'teaching_log.created_at'
        },
        updated: {
            label: '更新时间',
            columnType: NgxExcelColumnType.Text,
            prop: 'teaching_log.updated_at'
        },
        completion: {
            label: '完成情况',
            columnType: NgxExcelColumnType.SelectOption,
            selectOptions: this.getSelectOptions(Enums.StudentTeachLog.TeachLogStatus),
            prop: 'task_situation'
        },
        fact: {
            label: '真实情况',
            columnType: NgxExcelColumnType.MultilineText,
            prop: 'teaching_log.class_description'
        },
        classSituation: {
            label: '真实上课情况',
            columnType: NgxExcelColumnType.MultilineText,
            prop: 'teaching_log.real_class_description'
        },
        assignment: {
            label: '本次作业',
            columnType: NgxExcelColumnType.MultilineText,
            prop: 'teaching_log.task'
        }
    } as NgxExcelModelColumnRules<StudentTeacherLog>;


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
    ) {
        super(httpClient, backendService);
    }
}
