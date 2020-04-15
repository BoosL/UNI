import { SelectOption } from '@uni/core';

export interface StudentAchievements {
    id: string;
    type: SelectOption;
    testDate: string;
    resultDate: string;
    totalPoints: string;
    isProgressed: number;
    isQualified: number;
    subjects: StudentSubjects[];
    remark: string;
}

export interface StudentSubjects {
    id: string;
    name: string;
    fraction: string;
    remark: string;
}
