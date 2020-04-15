import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService, SchoolService } from '@uni/core';
import { StudentsPrimaryClass } from '../../models/student-primary-class.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { Enums } from '../enums';
import {StudentExtService} from '../students/student-ext.service';
import {PrimaryClassProductService} from './primary-class-product.service';

@Injectable({ providedIn: 'root' })
export class StudentPrimaryClassService extends BaseService<StudentsPrimaryClass>  {
    protected resourceUri = 'small_classes';
    protected resourceName = 'small_classes';

    protected rules = {
        id: { label: '小班主键', columnType: NgxExcelColumnType.PrimaryKey },
        name: {
            label: '小班名称',
            columnType: NgxExcelColumnType.Text,
        },
        classNumber: {
            label: '小班人数',
            columnType: NgxExcelColumnType.Text,
            prop: 'class_number'
        },
        allStudent: {
            label: '全部学员',
            columnType: NgxExcelColumnType.Text,
            prop: 'student_names'
        },
        importance: {
            label: '重视程度',
            columnType: NgxExcelColumnType.SelectOption,
            selectOptions: this.getSelectOptions(Enums.Student.ImportanceType),
            prop: 'importance_type',
        },
        school: {
            label: '所属校区', columnType: NgxExcelColumnType.ForeignKey,
            relativeService: this.schoolService, labelKey: 'name'
        },
        studentList: {
            label: '学员',
            columnType: NgxExcelColumnType.MultiForeignKey,
            relativeService: this.studentExtService,
            prop: 'students'
        },
        products: {
            label: '产品',
            columnType: NgxExcelColumnType.MultiForeignKey,
            relativeService: this.primaryClassProductService,
            prop: 'products'
        },
        remark: {
            label: '备注',
            columnType: NgxExcelColumnType.MultilineText,
        },
    } as NgxExcelModelColumnRules<StudentsPrimaryClass>;


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
        protected studentExtService: StudentExtService,
        protected schoolService: SchoolService,
        protected primaryClassProductService: PrimaryClassProductService
    ) {
        super(httpClient, backendService);
    }
}
