import { SelectOption, Student } from '@uni/core';

export interface StudentTaskAfterClass {
    id: string;
    actId: string;
    student: Student;
    task: string;
    time: string;
    status: SelectOption;
    remark: string;
    createdTime: string;
}



