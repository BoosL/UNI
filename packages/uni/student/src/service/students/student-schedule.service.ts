import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService, Student, StudentService } from '@uni/core';
import { Enums } from '../enums';
import { StudentSchedule } from '../../models/student-schedule.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules, NgxExcelService } from 'ngx-excel';


@Injectable({ providedIn: 'root' })
export class StudentScheduleService extends BaseService<StudentSchedule>  {

    protected resourceUri = 'campuses/{campus_id}/students/{student_id}/schedules';
    protected resourceName = 'student_schedules';

    protected rules = {
        id: { label: '时间管理主键', columnType: NgxExcelColumnType.PrimaryKey },
        student: {
            label: '关联的学员', columnType: NgxExcelColumnType.ForeignKey,
            relativeService: this.studentService as NgxExcelService<Student>, labelKey: 'name',
            prop: 'student'
        },
        startTime: { label: '开始时间', columnType: NgxExcelColumnType.Time },
        endTime: { label: '结束时间', columnType: NgxExcelColumnType.Time },
        week: {
            label: '周几', columnType: NgxExcelColumnType.SelectOption,
            selectOptions: this.getSelectOptions(Enums.Common.Week)
        },
    } as NgxExcelModelColumnRules<StudentSchedule>;

    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
        protected studentService: StudentService
    ) {
        super(httpClient, backendService);
    }
}
