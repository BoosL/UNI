import { SelectOption, Student, School } from '@uni/core';

export interface StudentSchedule {
    id: string;
    student: Student;
    school: School;
    startTime: string;
    endTime: string;
    week: SelectOption;
}



