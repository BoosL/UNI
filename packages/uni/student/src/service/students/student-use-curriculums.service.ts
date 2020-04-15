import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService, StudentService } from '@uni/core';
import { StudentUseCurriculums } from '../../models/student-use-curriculums.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { TeacherService } from '@uni/core';
import { Enums } from '../enums';

@Injectable({ providedIn: 'root' })
export class StudentUseCurriculumsService extends BaseService<StudentUseCurriculums>  {
    protected resourceUri = 'students/{student_id}/use_curriculums';
    protected resourceName = 'curriculums';

    protected rules = {
        id: { label: '已上课时主键', columnType: NgxExcelColumnType.PrimaryKey },
        name: {
            label: '排课名称',
            columnType: NgxExcelColumnType.Text,
            prop: 'curriculum_schedule.curriculum.name',
        },
        type: {
            label: '签课状态',
            columnType: NgxExcelColumnType.SelectOption,
            selectOptions: this.getSelectOptions(Enums.StudentUseCurriculums.SignClassStatus),
            prop: 'sign_class'
        },
        teachers: {
            label: '老师', columnType: NgxExcelColumnType.Text,
            prop: 'curriculum_schedule.teacher.full_name'
        },
        performance: {
            label: '完成情况',
            columnType: NgxExcelColumnType.SelectOption,
            selectOptions: this.getSelectOptions(Enums.StudentTaskAfterClass.TaskAfterClassStatus),
            prop: 'task_situation'
        }
    } as NgxExcelModelColumnRules<StudentUseCurriculums>;

    // sign_class 签课状态 task_situation 完成情况
    // 完成情况: 0：进行中 1：完成，质量较高2：完成，质量一般3：未完成
    // 签课状态：0：未签课 1：pass 扣课 2：repeat 不扣课 3：noshow 扣课 4：noshow不扣课 5：late 扣课


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
        protected studentService: StudentService,
        protected teacherService: TeacherService
    ) {
        super(httpClient, backendService);
    }
}
