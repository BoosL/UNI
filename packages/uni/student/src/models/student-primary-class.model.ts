import { School, SelectOption, StudentBoughtProduct} from '@uni/core';
import {StudentExt} from './student-ext.model';

export interface StudentsPrimaryClass {
    id: string;
    name: string;
    classNumber: string;
    allStudent: string;
    importance: SelectOption;
    school: School;
    remark: string;
    studentList: StudentExt[];
    products: StudentPrimaryProduct[];
}

export interface StudentsClass {
    id: string;
    student: StudentExt;
    product: StudentBoughtProduct;
    remark: string;
}

export interface StudentPrimaryProduct {
    id: string;
    name: string;
    type_name: string;
    valid_month: string;
    is_presented: string;
    is_plus_valid: string;
    is_packaged: string;
    remark: string;
}



