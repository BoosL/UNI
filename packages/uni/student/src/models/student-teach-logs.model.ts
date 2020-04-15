import { UploadFile, SelectOption } from '@uni/core';


export interface StudentTeacherLog {
    id: string;
    name: string;
    data: string;
    teacher: string;
    newLogTime: string;
    updated: string;
    completion: SelectOption;
    fact: string;
    classSituation: string;
    assignment: string;
}


export interface StudentTeacherLogComment {
    id: string;
    englishName: string;
    fullName: string;
    content: string;
    createdTime: string;
    oldName: string;
    file_url: string;
    remark: string;
    attachments: UploadFile[];
}

