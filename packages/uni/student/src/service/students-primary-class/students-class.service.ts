import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService , StudentBoughtProductService} from '@uni/core';
import { NgxExcelColumnType, NgxExcelModelColumnRule } from 'ngx-excel';
import {StudentsClass} from '../../models/student-primary-class.model';
import {StudentExtService} from '../students/student-ext.service';

@Injectable({ providedIn: 'root' })
export class StudentClassService extends BaseService<StudentsClass> {
    protected resourceUri = '';
    protected resourceName = '';

    protected rules = {
        id: { label: '小班学员主键', columnType: NgxExcelColumnType.PrimaryKey },
        student: {
            label: '选择学员',
            columnType: NgxExcelColumnType.ForeignKey,
            relativeService: this.studentExtService,
            labelKey: 'name',
            typeaheadKey: 'keyword',
        },
        product: {
            label: '选择产品',
            columnType: NgxExcelColumnType.ForeignKey,
            relativeService: this.studentProductsService,
            labelKey: 'name',
            typeaheadKey: 'keyword',
        },
        remark: { label: '备注', columnType: NgxExcelColumnType.Text },
    } as { [id in keyof StudentsClass]: NgxExcelModelColumnRule<StudentsClass> };


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
        protected studentExtService: StudentExtService,
        protected studentProductsService: StudentBoughtProductService
    ) {
        super(httpClient, backendService);
    }

}
