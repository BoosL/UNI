import { SelectOption, Student } from '@uni/core';


export interface StudentTransferSchool {
    id: string;
    student: Student;
    campus: string;
    intoCmpus: SelectOption;
    expiredProduct: SelectOption;
    balance: SelectOption;
    number: string;
    remark: string;
}


export interface StudentTransferSchoolDetails {
    id: string;
    outContractAmount: string;
    intocContractAmount: string;
    diffAmount: string;
    customSpread: string;
}


