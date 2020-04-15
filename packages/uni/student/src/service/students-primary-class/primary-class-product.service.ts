import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService, BaseService } from '@uni/core';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import {StudentPrimaryProduct} from '../../models/student-primary-class.model';
@Injectable({ providedIn: 'root' })
export class PrimaryClassProductService extends BaseService<StudentPrimaryProduct> {
    protected resourceUri = '';
    protected resourceName = '';

    protected rules = {
        id: { label: '#', columnType: NgxExcelColumnType.PrimaryKey },
        name: { label: '产品名', columnType: NgxExcelColumnType.Text },
        type_name: { label: '产品类型', columnType: NgxExcelColumnType.Text },
        valid_month: { label: '有效期月数', columnType: NgxExcelColumnType.Text },
        is_presented: {
            label: '是否累加',
            columnType: NgxExcelColumnType.Text,
        },
        is_plus_valid: {
            label: '是否为套餐产品',
            columnType: NgxExcelColumnType.Text,
        },
        is_packaged: {
            label: '是否是赠品',
            columnType: NgxExcelColumnType.Text,
        },
        remark: { label: '产品备注', columnType: NgxExcelColumnType.Text },
    } as NgxExcelModelColumnRules<StudentPrimaryProduct>;


    constructor(
        protected httpClient: HttpClient,
        protected backendService: BackendService,
    ) {
        super(httpClient, backendService);
    }

}
