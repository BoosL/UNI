import { SelectOption } from '@uni/core';

export interface StudentComplain {
    id: string;
    theme: string;
    student: string;
    complaintDate: string;
    complaintsType: SelectOption;
    byComplainant: string;
    manage: string;
    state: string;
    campus: string;
    remark: string;
}


export interface StudentComplainFollow {
    id: string;
    hanbdleData: string;
    status: SelectOption;
    remark: string;
    manage: string;
}



